import { stat } from "fs/promises";
import path from "path";
import {
  EntityManager,
  FileEntity,
  LibraryEntity,
  MikroORM,
  TaskEntity,
  TaskService,
  TaskType,
  Times,
  TitleEntity,
} from "@hembio/core";
import { pathWalker } from "@hembio/fs";
import { createLogger } from "@hembio/logger";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import chokidar from "chokidar";
import PQueue from "p-queue";
import slugify from "slug";
import pkg from "../package.json";
import { fetchMetadata } from "./fetchMetadata";
import { MetadataService } from "./metadata/metadata.service";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class IndexerService {
  private logger = createLogger("indexer");
  private runners = new Set<string>();

  private readonly taskQueue = new PQueue({
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
      // this.watchForFileChanges();
      await this.checkAllLibraries();
      await this.runTasks();
      this.metadataService.checkMissingMetadata();
    }, 1000);
  }

  public getVersion(): string {
    return pkg.version;
  }

  private async runner(name: string, fn: () => Promise<void>) {
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

    const em = this.em.fork(false);
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
          await sleep(50);
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
    const em = this.em.fork(false);
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
    const em = this.em.fork(false);
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
    const title = titleRepo.create({
      slug,
      type: library.type,
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
        tasks = await this.tasks.getTasks([TaskType.INDEXER], 10);
      }

      if (tasks.length > 0) {
        this.logger.debug(`Running ${tasks.length} indexer tasks`);

        const em = this.em.fork(false);
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
      nextTasks = await this.tasks.getTasks([TaskType.INDEXER], 10);
    } catch (e) {
      this.logger.error(e);
    }

    if (nextTasks.length > 0) {
      this.runTasks(nextTasks);
    }
  }

  public async watchForFileChanges(): Promise<void> {
    const em = this.em.fork(false);
    const libraryRepo = em.getRepository(LibraryEntity);
    const libraries = await libraryRepo.findAll();

    for (const library of libraries) {
      if (library.watch) {
        chokidar
          .watch(library.path, {
            usePolling: true,
            interval: 60000,
            binaryInterval: 60000,
            depth: 2,
            ignoreInitial: true,
          })
          .on("addDir", (addedDir) => {
            this.logger.debug(`Directory added: ${addedDir}`);
          })
          .on("add", async (addedFile) => {
            if (library.matcherRegEx.test(addedFile)) {
              this.logger.debug(`File added: ${addedFile}`);
              await this.checkPath(library, path.dirname(addedFile));
            }
          })
          .on("unlinkDir", (removedDir) => {
            this.logger.debug(`Directory removed: ${removedDir}`);
          })
          .on("unlink", async (removedFile) => {
            if (library.matcherRegEx.test(removedFile)) {
              this.logger.debug(`File removed: ${removedFile}`);
              const fileRepo = em.getRepository(FileEntity);
              const relPath = path.relative(library.path, removedFile);
              const found = await fileRepo.find({ path: relPath });
              if (found) {
                try {
                  await fileRepo.removeAndFlush(found);
                } catch {
                  // Ignore
                }
              }
            }
          })
          .on("ready", () => {
            this.logger.debug(`Watching for file changes in ${library.path}`);
          });
      }
    }
  }
}
