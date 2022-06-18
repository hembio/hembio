import { existsSync } from "fs";
import { stat } from "fs/promises";
import path from "path";
import {
  EntityManager,
  FileEntity,
  LibraryEntity,
  LibraryType,
  MikroORM,
  TaskEntity,
  TaskService,
  TaskType,
  Times,
  TitleEntity,
  TitleType,
} from "@hembio/core";
import { pathWalker } from "@hembio/fs";
import { createLogger } from "@hembio/logger";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import PQueue from "p-queue";
import slugify from "slug";
import { fetchMetadata } from "../fetchMetadata";
import { MetadataService } from "../metadata/metadata.service";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class LibraryService {
  private logger = createLogger("indexer");
  private runners = new Set<string>();

  private tasksPerBatch = 10;
  private readonly taskQueue = new PQueue({
    concurrency: this.tasksPerBatch,
  });

  private readonly removeQueue = new PQueue({
    concurrency: 5,
  });

  public constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly tasks: TaskService,
    private readonly metadataService: MetadataService,
  ) {
    setTimeout(async () => {
      await this.orm.isConnected();
      //await this.removeDeletedFilesAndTitles();
      await this.checkAllLibraries();
      await this.runTasks();
      this.metadataService.checkMissingMetadata();
    }, 1000);
  }

  private async runner(name: string, fn: () => Promise<void>): Promise<void> {
    if (this.runners.has(name)) {
      return;
    }
    this.runners.add(name);
    await fn();
    this.runners.delete(name);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async checkAllLibraries(): Promise<void> {
    try {
      const libraryRepo = this.em.getRepository(LibraryEntity);
      const libraries = await libraryRepo.findAll();
      for (const library of libraries) {
        this.checkForNewTitles(library.id);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  public async checkForNewTitles(libraryId: string): Promise<void> {
    const runnerName = `checkForNewTitles-${libraryId}`;
    if (this.runners.has(runnerName)) {
      return;
    }

    this.logger.info("Checking for new titles and files...");
    this.runners.add(runnerName);

    const em = this.em.fork();
    const libraryRepo = em.getRepository(LibraryEntity);

    const library = await libraryRepo.findOne(libraryId);
    try {
      if (library) {
        for await (const dirPath of pathWalker(library.path, {
          yieldFile: false,
          yieldDir: true,
          depth: 1,
        })) {
          await this.checkPath(library, dirPath);
          await sleep(20);
        }
      }
    } catch (e) {
      this.logger.error(e);
    }

    this.runners.delete(runnerName);

    // Let's kick off the task runner directly
    this.runTasks();
  }

  public async checkPath(
    library: LibraryEntity,
    dirPath: string,
  ): Promise<void> {
    const em = this.em.fork();
    const titleRepo = em.getRepository(TitleEntity);
    const fileRepo = em.getRepository(FileEntity);
    const relDirPath = path.relative(library.path, dirPath);
    const existingTitle = await titleRepo.findOne({
      path: relDirPath,
    });
    if (existingTitle) {
      for await (const filePath of pathWalker(dirPath, {
        yieldDir: false,
        yieldFile: true,
        depth: 1,
      })) {
        if (!library.matcherRegEx.test(filePath)) {
          continue;
        }
        const relFilePath = path.relative(library.path, filePath);
        const existingFile = await fileRepo.findOne({
          path: relFilePath,
        });
        if (!existingFile) {
          const task = await this.tasks.createTask({
            type: TaskType.INDEXER,
            ref: relFilePath,
            priority: 2,
            payload: {
              event: "new_file",
              libraryId: library.id,
              titleId: existingTitle.id,
              path: relFilePath,
            },
          });
          if (task) {
            this.logger.info(`Found new file: ${relFilePath}`);
          }
        }
      }
    } else {
      // Found new title
      const task = await this.tasks.createTask({
        type: TaskType.INDEXER,
        ref: relDirPath,
        priority: 5,
        payload: {
          event: "new_title",
          libraryId: library.id,
          path: relDirPath,
        },
      });
      if (task) {
        this.logger.info(`Found new title: ${relDirPath}`);
      }
    }
  }

  public async createTitle(
    libraryId: string,
    titlePath: string,
  ): Promise<TitleEntity | undefined> {
    const em = this.em.fork();
    const libraryRepo = em.getRepository(LibraryEntity);
    const titleRepo = em.getRepository(TitleEntity);
    const fileRepo = em.getRepository(FileEntity);

    const library = await libraryRepo.findOne(libraryId);
    if (!library) {
      this.logger.error(`Library ${library} was not found`);
      return;
    }
    this.logger.debug(`Looking up match for ${titlePath}`);
    const metadata = await fetchMetadata(titlePath);
    if (!metadata) {
      this.logger.warn(`No metadata was found for ${titlePath}`);
      return;
    }
    this.logger.debug({ metadata }, `Got match for ${titlePath}`);
    let slugExists = true;
    let slugTry = 0;
    let slug = slugify(`${metadata.name}-${metadata.year}`);
    while (slugExists) {
      const count = await titleRepo.count({
        slug,
      });
      if (count !== 0) {
        slugTry++;
        this.logger.debug(
          `Slug already exists. Incrementing with ${slugTry}...`,
        );
        slug = slugify(`${metadata.name}-${metadata.year}-${slugTry}`);
        continue;
      }
      slugExists = false;
    }

    const titleType =
      library.type === LibraryType.MOVIES ? TitleType.MOVIE : TitleType.TVSHOW;

    const title = titleRepo.create({
      slug,
      type: titleType,
      path: titlePath,
      idImdb: metadata.ids.imdb,
      idTmdb: metadata.ids.tmdb,
      idOmdb: metadata.ids.omdb,
      idTrakt: metadata.ids.trakt,
      idTvdb: metadata.ids.tvdb,
      idTvrage: metadata.ids.tvrage,
      name: metadata.name,
      year: metadata.year,
      library: library.id,
    });

    try {
      titleRepo.persist(title);
      this.logger.info(
        `Added title(${title.id}): ${title.name} (${title.year})`,
      );

      const titlePath = path.join(library.path, title.path);
      this.logger.debug(`Check path ${titlePath} for files`);
      for await (const filePath of pathWalker(titlePath, {
        yieldFile: true,
        yieldDir: false,
        depth: 1,
      })) {
        if (!library.matcherRegEx.test(filePath)) {
          continue;
        }
        const relPath = path.relative(library.path, filePath);
        const existingFile = await fileRepo.findOne({ path: relPath });
        if (existingFile) {
          existingFile.title = title;
          title.files.add(existingFile);
          titleRepo.persist(title);
          this.logger.info(`Updated file(${existingFile.id}): ${title.path}`);
        } else {
          try {
            const stats = await stat(filePath);
            const file = fileRepo.create({
              library: libraryId,
              path: path.relative(library.path, filePath),
              size: stats.size,
              ctime: stats.ctime.getTime(),
              mtime: stats.mtime.getTime(),
            });
            title.files.add(file);
            titleRepo.persist(title);
            this.logger.info(`Added file(${file.id}): ${title.path}`);
          } catch (e) {
            this.logger.error(e, "Failed to add file");
          }
        }
      }
    } catch (e) {
      this.logger.error(e, "Failed to add title");
    }

    try {
      await em.flush();
    } catch (e) {
      this.logger.error(e);
    }
    return title;
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async runTasks(tasks?: TaskEntity[]): Promise<void> {
    const runnerName = `runTasks`;
    if (this.runners.has(runnerName)) {
      this.logger.debug("Indexer tasks are already running");
      return;
    }
    this.runners.add(runnerName);
    try {
      if (!tasks) {
        tasks = await this.tasks.getTasks(
          [TaskType.INDEXER],
          this.tasksPerBatch,
        );
      }

      if (tasks.length > 0) {
        this.logger.debug(`Running ${tasks.length} indexer tasks`);

        const em = this.em.fork();
        const libraryRepo = em.getRepository(LibraryEntity);
        const fileRepo = em.getRepository(FileEntity);
        const titleRepo = em.getRepository(TitleEntity);

        for (const task of tasks) {
          const { ref, payload } = task;
          switch (payload.event) {
            case "new_title": {
              this.taskQueue.add(async () => {
                try {
                  const title = await this.createTitle(payload.libraryId, ref);
                  if (!title) {
                    await this.tasks.waitUntil(
                      task,
                      new Date(Date.now() + Times.ONE_DAY),
                    );
                    return;
                  }
                  await this.tasks.deleteTask(task);
                  await this.tasks.createTask({
                    type: TaskType.METADATA,
                    ref: title.id,
                    priority: 5,
                  });
                  await this.tasks.createTask({
                    type: TaskType.IMAGES,
                    ref: title.id,
                    priority: 5,
                    payload: { type: "title" },
                  });
                  await this.tasks.createTask({
                    type: TaskType.CREDITS,
                    ref: title.id,
                    priority: 5,
                  });
                } catch (e) {
                  this.logger.error(e, "Failed to create title");
                }
              });
              break;
            }
            case "new_file": {
              this.taskQueue.add(async () => {
                const library = await libraryRepo.findOne(payload.libraryId);
                const title = await titleRepo.findOne(payload.titleId);
                const file = await fileRepo.findOne({ path: ref });
                if (library && title && !file) {
                  const stats = await stat(path.join(library.path, ref));
                  const file = fileRepo.create({
                    library: payload.libraryId,
                    title: title,
                    path: ref,
                    size: stats.size,
                    ctime: stats.ctime.getTime(),
                    mtime: stats.mtime.getTime(),
                  });
                  title.files.add(file);
                  try {
                    titleRepo.persist(title);
                    this.logger.info(
                      `New file added(${file.id}): ${title.path}`,
                    );
                  } catch (e) {
                    this.logger.error(e, "Failed to add file");
                  }
                }
                try {
                  await this.tasks.deleteTask(task);
                } catch (e) {
                  this.logger.error(e, "Failed to delete task");
                }
              });
              break;
            }
          }
        }
        await this.taskQueue.onIdle();
        try {
          await em.flush();
        } catch (e) {
          this.logger.error(e);
        }
      }
    } catch (e) {
      this.logger.error(e);
    }
    this.runners.delete(runnerName);

    let nextTasks: TaskEntity[] = [];
    try {
      nextTasks = await this.tasks.getTasks(
        [TaskType.INDEXER],
        this.tasksPerBatch,
      );
    } catch (e) {
      this.logger.error(e);
    }

    if (nextTasks.length > 0) {
      this.runTasks(nextTasks);
    }
  }

  public async removeTitle(titleId: string): Promise<boolean> {
    const em = this.em.fork();
    const title = await em.findOne(TitleEntity, titleId);
    if (!title) {
      return false;
    }
    const credits = await title.credits.init();
    for (const credit of credits) {
      em.remove(credit);
    }
    const files = await title.files.init();
    for (const file of files) {
      em.remove(file);
    }
    const images = await title.images.init();
    for (const image of images) {
      em.remove(image);
    }
    try {
      await em.removeAndFlush(title);
      this.logger.debug(
        `Removed title ${title.id}: ${title.name} (${title.year})`,
      );
      return true;
    } catch (e) {
      this.logger.error(e, "Failed to remove title");
      return false;
    }
  }

  public async removeFile(fileId: string): Promise<boolean> {
    const em = this.em.fork();
    const file = await em.findOne(FileEntity, fileId);
    if (!file) {
      return false;
    }
    try {
      await em.removeAndFlush(file);
      this.logger.debug(`Removed file ${file.id}: ${file.path}`);
      return true;
    } catch (e) {
      this.logger.error(e, "Failed to remove file");
      return false;
    }
  }

  public async removeDeletedFilesAndTitles(): Promise<void> {
    const runnerName = "removeDeletedFilesAndTitles";
    if (this.runners.has(runnerName)) {
      return;
    }
    this.logger.info("Removing deleted filed and titles...");
    this.runners.add(runnerName);
    const em = this.em.fork();
    const libraryRepo = em.getRepository(LibraryEntity);
    const titleRepo = em.getRepository(TitleEntity);
    const libraries = await libraryRepo.findAll();
    for (const library of libraries) {
      const titles = await titleRepo.findAll();
      for (const title of titles) {
        const titlePath = path.join(library.path, title.path);
        if (!existsSync(titlePath)) {
          this.removeQueue.add(() => this.removeTitle(title.id));
          continue;
        }
        const files = await title.files.init();
        for (const file of files) {
          const filePath = path.join(library.path, file.path);
          if (!existsSync(filePath)) {
            this.removeQueue.add(() => this.removeFile(file.id));
            continue;
          }
        }
      }
    }
    await this.removeQueue.onIdle();
    this.runners.delete(runnerName);
  }
}
