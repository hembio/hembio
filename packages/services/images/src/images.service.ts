import { mkdir, writeFile } from "fs/promises";
import path from "path";
import {
  getCwd,
  TaskService,
  Times,
  TaskType,
  TitleEntity,
  EntityManager,
  EntityRepository,
  TitleType,
  PersonEntity,
  MikroORM,
  TaskEntity,
} from "@hembio/core";
import { createLogger } from "@hembio/logger";
import { FanartProvider, ImagesResult, TMDbProvider } from "@hembio/metadata";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import axios from "axios";
import ColorThief from "color-thief-jimp";
import Jimp from "jimp";
import PQueue from "p-queue";

export interface DownloadTitleImagesResult {
  code?: number;
  error?: string;
  data?: ImagesResult["images"];
}

function numHex(s: number) {
  let a = s.toString(16);
  if (a.length % 2 > 0) {
    a = "0" + a;
  }
  return a;
}

@Injectable()
export class ImagesService {
  private isRunning = false;
  private readonly logger = createLogger("images");
  private readonly http = axios.create({
    timeout: 10000,
    // adapter: httpAdapter,
    responseType: "arraybuffer",
    // headers: {
    //   "User-Agent":
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43",
    // },
  });
  private runners = new Set<string>();

  // Stay within the rate limit of assets.fanart.tv
  private readonly titleImageFetchQueue = new PQueue({
    concurrency: 6,
    intervalCap: 12,
    interval: 3000,
    carryoverConcurrencyCount: true,
  });

  // Stay within the rate limit of TMDb
  private readonly personImageFetchQueue = new PQueue({
    concurrency: 6,
    intervalCap: 12,
    interval: 3000,
    carryoverConcurrencyCount: true,
  });

  private readonly taskQueue = new PQueue({
    concurrency: 20,
  });

  // TODO: Use metadata microservice instead
  private readonly fanartProvider = new FanartProvider();
  private readonly tmdbProvider = new TMDbProvider();

  public constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly tasks: TaskService,
  ) {
    setTimeout(async () => {
      await this.orm.isConnected();
      await this.checkMissingImages();
      await this.runTasks();
    }, 1000);
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  public async checkMissingImages(): Promise<void> {
    const runnerName = "checkMissingImages";
    if (this.runners.has(runnerName)) {
      return;
    }
    this.runners.add(runnerName);

    try {
      this.logger.debug(`Checking for missing images...`);
      const em = this.em.fork(false);
      const titleRepo = em.getRepository(TitleEntity);
      const titles = await titleRepo.find(
        {
          thumb: null,
          idImdb: { $ne: null },
        },
        { fields: ["id"] },
      );
      for (const title of titles) {
        const task = await this.tasks.createTask({
          type: TaskType.IMAGES,
          ref: title.id,
          priority: 2,
          payload: { type: "title" },
        });
        if (task) {
          this.logger.debug(`Created download task for title(${title.id})`);
        }
      }

      const personRepo = this.em.getRepository(PersonEntity);
      const people = await personRepo.find({ image: null }, { fields: ["id"] });
      for (const person of people) {
        const task = await this.tasks.createTask({
          type: TaskType.IMAGES,
          ref: person.id,
          priority: 1,
          payload: { type: "person" },
        });
        if (task) {
          this.logger.debug(`Created download task for person ${person.id}`);
        }
      }
    } catch {
      // Ignore
    }
    this.runners.delete(runnerName);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async runTasks(tasks?: TaskEntity[]): Promise<void> {
    const runnerName = "runTasks";
    if (this.runners.has(runnerName)) {
      // this.logger.debug("Tasks are already running");
      return;
    }

    this.runners.add(runnerName);

    try {
      if (!tasks) {
        tasks = await this.tasks.getTasks(TaskType.IMAGES, 20);
      }

      if (tasks.length > 0) {
        this.logger.debug(`Running ${tasks.length} images tasks`);
        for (const task of tasks) {
          if (task.payload.type === "title") {
            this.taskQueue.add(async () => {
              this.logger.debug(`Downloading images for title(${task.ref})`);
              const result = await this.downloadTitleImages(task.ref);
              const missingPoster = (result.data?.poster || []).length === 0;
              if (missingPoster) {
                this.logger.debug(`No images found for title(${task.ref})`);
                // Wait 1 day before running again
                const waitUntil = new Date(Date.now() + Times.ONE_DAY);
                await this.tasks.waitUntil(task, waitUntil);
              } else if (result.error) {
                this.logger.debug(
                  `Failed to download images for title(${task.ref})`,
                );
                // Wait 30 minutes before trying again
                const waitUntil = new Date(Date.now() + Times.THIRTY_MINUTES);
                await this.tasks.waitUntil(task, waitUntil);
              } else {
                await this.tasks.deleteTask(task);
              }
            });
          } else if (task.payload.type === "person") {
            this.taskQueue.add(async () => {
              this.logger.debug(`Downloading images for person(${task.ref})`);
              const result = await this.downloadPersonImages(task.ref);
              if (!result) {
                this.logger.debug(`No images found for person(${task.ref})`);
                // Wait 1 day before running again
                const waitUntil = new Date(Date.now() + Times.ONE_WEEK);
                await this.tasks.waitUntil(task, waitUntil);
              } else {
                await this.tasks.deleteTask(task);
              }
            });
          }
        }
        await this.taskQueue.onIdle();
      }
    } catch {
      // Ignore
    }

    this.runners.delete(runnerName);
    const nextTasks = await this.tasks.getTasks(TaskType.IMAGES, 10);
    if (nextTasks.length > 0) {
      this.runTasks(nextTasks);
    }
  }

  private getLowestMiddleHighest(
    rgbIntArray: number[],
  ): Array<{ val: number; index: number }> {
    let highest = { val: -1, index: -1 };
    let lowest = { val: Infinity, index: -1 };

    rgbIntArray.map((val, index) => {
      if (val > highest.val) {
        highest = { val, index };
      }
      if (val < lowest.val) {
        lowest = { val, index };
      }
    });

    if (lowest.index === highest.index) {
      lowest.index = highest.index + 1;
    }

    const middle = { val: 0, index: 3 - highest.index - lowest.index };
    middle.val = rgbIntArray[middle.index];
    return [lowest, middle, highest];
  }

  private darkenByTenth(rgb: string): string {
    // Our rgb to int array function again
    const rgbIntArray = [rgb.substr(0, 2), rgb.substr(2, 2), rgb.substr(4)].map(
      (v) => parseInt(v, 16),
    );

    //grab the values in order of magnitude
    //this uses the function from the saturate function
    const [lowest, middle, highest] = this.getLowestMiddleHighest(rgbIntArray);

    if (highest.val === 0) {
      return rgb;
    }

    const returnArray = [];

    returnArray[highest.index] = highest.val - Math.min(highest.val, 25.5);
    const decreaseFraction =
      (highest.val - returnArray[highest.index]) / highest.val;
    returnArray[middle.index] = middle.val - middle.val * decreaseFraction;
    returnArray[lowest.index] = lowest.val - lowest.val * decreaseFraction;

    // Convert the array back into an rgb string
    return returnArray.map(Math.round).map(numHex).join("");
  }

  private isColorTooBright(rgb: string): boolean {
    const c = rgb.substring(1); // strip #
    const parsed = parseInt(c, 16); // convert rrggbb to decimal
    const r = (parsed >> 16) & 0xff; // extract red
    const g = (parsed >> 8) & 0xff; // extract green
    const b = (parsed >> 0) & 0xff; // extract blue
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma > 40;
  }

  private async getDominantColor(image: Jimp) {
    try {
      const colors = ColorThief.getPaletteHex(image);
      for (const color of colors) {
        if (!this.isColorTooBright(color)) {
          return color;
        }
      }
      let firstColor = colors[0];
      while (this.isColorTooBright(firstColor)) {
        firstColor = this.darkenByTenth(firstColor);
      }
      return firstColor;
    } catch {
      // Ignore if it fails
    }
  }

  public async generateThumb(
    titleRepo: EntityRepository<TitleEntity>,
    title: TitleEntity,
    imageBuffer: Buffer,
  ): Promise<void> {
    const image = await Jimp.read(imageBuffer);
    const thumb = image
      .resize(8, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR)
      .dither565()
      .quality(20);
    title.dominantColor = await this.getDominantColor(thumb);
    title.thumb = await thumb.getBase64Async("image/png");
    try {
      await titleRepo.persistAndFlush(title);
    } catch {
      // Ignore
    }
  }

  public async downloadTitleImages(
    id: string,
  ): Promise<DownloadTitleImagesResult> {
    const em = this.em.fork(false);
    const titleRepo = em.getRepository(TitleEntity);
    const imgDir = path.resolve(getCwd(), ".images/titles");
    const title = await titleRepo.findOne(id);

    if (!title) {
      return { code: 404, error: "Title does not exist" };
    }

    const { imdb: imdbId } = title.externalIds;
    if (!imdbId) {
      return { code: 404, error: "Title is missing iMDb id" };
    }

    const [fanartResult, tmdbResult] = await Promise.all([
      this.fanartProvider.images(imdbId),
      this.tmdbProvider.images(TitleType.MOVIE, imdbId),
    ]);

    if (!fanartResult && !tmdbResult) {
      return { code: 404, error: "Couldn't find any images for title" };
    }

    // Object.values(tmdbResult?.images || {}).forEach((images) => {
    //   for (const image of images) {
    //     image.score = (image.score + 10) * 2;
    //   }
    // });

    const mergedImages = {
      ...fanartResult?.images,
      background: [
        ...(fanartResult?.images.background || []),
        ...(tmdbResult?.images.background || []),
      ],
      poster: [
        ...(fanartResult?.images.poster || []),
        ...(tmdbResult?.images.poster || []),
      ],
    };

    try {
      await mkdir(path.join(imgDir, title.id), { recursive: true });
    } catch {
      // Ignore
    }

    const cats = Object.keys(mergedImages) as Array<keyof typeof mergedImages>;

    // this.logger.debug({ mergedImages });

    //  ／l、
    // ﾞ（ﾟ､ ｡ ７ meow!
    //  l、ﾞ ~ヽ
    //  じしf_, )ノ
    for (const cat of cats) {
      const allImages =
        mergedImages[cat]?.sort((a, b) =>
          a.score === b.score ? 0 : a.score > b.score ? -1 : 1,
        ) || [];
      const enImages =
        mergedImages[cat]?.filter((e) => (e.lang ? e.lang === "en" : true)) ||
        [];
      if (allImages.length === 0) {
        continue;
      }

      const bestImage = enImages[0] || allImages[0];
      if (bestImage) {
        const downloadFile = async () => {
          try {
            this.logger.debug(`Downloading ${cat} ${bestImage.url}`);
            const pres = await this.http.get(bestImage.url);
            const imageBuffer = pres.data;
            const imageFile = path.join(imgDir, title.id, `${cat}.jpg`);
            await writeFile(imageFile, imageBuffer);
            if (cat === "poster") {
              await this.generateThumb(titleRepo, title, imageBuffer);
            }
          } catch (e) {
            if (!e.response) {
              this.logger.error(e, "Failed to download image!");
              return;
            }
            if (e.response?.status === 404) {
              // Ignore 404
              return;
            }
            if (e.response?.status === 503) {
              this.titleImageFetchQueue.pause();
              this.logger.error(
                "Hit rate limit! Pausing queue for 10 seconds.",
              );
              // Re-add download to queue
              this.titleImageFetchQueue.add(downloadFile);
              setTimeout(() => {
                this.titleImageFetchQueue.start();
              }, 10000);
            } else {
              this.logger.error(e, "Failed to download image!");
            }
          }
        };
        this.titleImageFetchQueue.add(downloadFile);
      }
    }
    await this.titleImageFetchQueue.onIdle();
    return { data: mergedImages };
  }

  public async downloadPersonImages(id: string): Promise<boolean> {
    const em = this.em.fork(false);
    const personRepo = em.getRepository(PersonEntity);
    const imgDir = path.resolve(getCwd(), ".images/people");
    const person = await personRepo.findOne(id);
    if (!person) {
      this.logger.warn(`Person ${id} not found!`);
      return false;
    }
    const task = this.personImageFetchQueue.add(async () => {
      const res = await this.tmdbProvider.person(person.idTmdb);
      if (res && res.profile_path) {
        try {
          const img = `https://www.themoviedb.org/t/p/w1280${res.profile_path}`;
          this.logger.debug(`Downloading ${person.name} ${img}`);
          const pres = await this.http.get(img);
          const imageBuffer = pres.data;
          const imageFile = path.join(imgDir, `${person.id}.jpg`);
          await writeFile(imageFile, imageBuffer);
          person.image = `/${person.id}.jpg`;
          await personRepo.persistAndFlush(person);
          return true;
        } catch {
          // Ignore
        }
      }
      this.logger.debug(`No image found(${person.id}): ${person.name}`);
      return false;
    });
    return task;
  }

  public async queueTitleImagesUpdate(titleId: string): Promise<boolean> {
    const em = this.em.fork(false);
    const count = await em.count(TitleEntity, titleId);
    if (count === 0) {
      throw Error("Title not found");
    }

    const task = await this.tasks.createTask({
      type: TaskType.IMAGES,
      ref: titleId,
      priority: 10,
      payload: { type: "title" },
    });

    if (task) {
      this.logger.debug(`Queued images update for title(${titleId})`);
    }

    return !!task;
  }

  public async queuePersonImageUpdate(personId: string): Promise<boolean> {
    const em = this.em.fork(false);
    const count = await em.count(PersonEntity, personId);
    if (count === 0) {
      throw Error("Person not found");
    }

    const task = await this.tasks.createTask({
      type: TaskType.IMAGES,
      ref: personId,
      priority: 10,
      payload: { type: "person" },
    });

    if (task) {
      this.logger.debug(`Queued images update for person(${personId})`);
    }

    return !!task;
  }
}
