import {
  EntityManager,
  GenreEntity,
  MikroORM,
  TaskEntity,
  TaskService,
  TaskType,
  Times,
  TitleEntity,
  TitleType,
} from "@hembio/core";
import { createLogger } from "@hembio/logger";
import { TMDbProvider, TraktProvider } from "@hembio/metadata";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import PQueue from "p-queue";

@Injectable()
export class MetadataService {
  private logger = createLogger("metadata");
  private trakt = new TraktProvider();
  private tmdb = new TMDbProvider();
  private runners = new Set<string>();

  private readonly taskQueue = new PQueue({
    concurrency: 5,
  });

  public constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly tasks: TaskService,
  ) {
    // setTimeout(async () => {
    //   await this.orm.isConnected();
    //   await this.checkMissingMetadata();
    //   await this.runTasks();
    // }, 1000);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async runTasks(tasks?: TaskEntity[]): Promise<void> {
    const runnerName = `runTasks`;
    if (this.runners.has(runnerName)) {
      this.logger.debug("Metadata tasks are already running");
      return;
    }
    this.runners.add(runnerName);

    try {
      tasks = tasks || (await this.tasks.getTasks(TaskType.METADATA, 10));

      if (tasks.length > 0) {
        this.logger.debug(`Running ${tasks.length} metadata tasks`);

        for (const task of tasks) {
          const { ref } = task;
          this.taskQueue.add(async () => {
            try {
              const found = await this.lookupMetadata(ref);
              if (!found) {
                const waitUntil = new Date(Date.now() + Times.ONE_DAY);
                await this.tasks.waitUntil(task, waitUntil);
              } else {
                await this.tasks.deleteTask(task);
              }
            } catch (e) {
              this.logger.debug(e);
              this.logger.debug(`Removing broken task(${task.id})`);
              await this.tasks.deleteTask(task);
            }
          });
        }
        await this.taskQueue.onIdle();
      }
    } catch (e) {
      this.logger.error(e);
    }

    this.runners.delete(runnerName);

    let nextTasks: TaskEntity[] = [];
    try {
      nextTasks = await this.tasks.getTasks([TaskType.METADATA], 10);
    } catch (e) {
      this.logger.error(e);
    }

    if (nextTasks.length > 0) {
      this.runTasks(nextTasks);
    }
  }

  public async lookupMetadata(titleId: string): Promise<boolean> {
    const em = this.em.fork(false);
    const titleRepo = em.getRepository(TitleEntity);
    const genreRepo = em.getRepository(GenreEntity);

    const title = await titleRepo.findOne(titleId);

    if (!title) {
      throw Error(`Title ${titleId} not found`);
    }

    if (!title.idTrakt && !title.idTmdb && !title.idImdb) {
      return false;
    }

    this.logger.debug(
      `Looking up metadata(${title.id}): ${title.name} (${title.year})`,
    );

    const tmdbOrImdb = title.idTmdb || title.idImdb;
    let found = false;
    if (title.type === TitleType.MOVIE) {
      const [traktData, tmdbData] = await Promise.all([
        title.idTrakt
          ? this.trakt.metadata(title.type, title.idTrakt)
          : undefined,
        tmdbOrImdb ? this.tmdb.metadata(title.type, tmdbOrImdb) : undefined,
      ]);

      if (!traktData && !tmdbData) {
        this.logger.debug(
          `No metadata found(${title.id}): ${title.name} (${title.year})`,
        );
        return false;
      }

      if (traktData) {
        if (traktData.release_date) {
          title.releaseDate = new Date(traktData.release_date);
        }
        if (traktData.rating) {
          title.ratingTrakt = traktData.rating;
        }
        if (traktData.tagline) {
          title.tagline = traktData.tagline;
        }
        if (traktData.overview) {
          title.overview = traktData.overview;
        }
        if (traktData.certification) {
          title.certification = traktData.certification;
        }
        if (traktData.runtime) {
          title.runtime = traktData.runtime;
        }
      }

      if (tmdbData) {
        if (tmdbData.release_date) {
          title.releaseDate = new Date(tmdbData.release_date);
        }
        if (tmdbData.vote_average) {
          title.ratingImdb = tmdbData.vote_average;
        }
        if (tmdbData.tagline) {
          title.tagline = tmdbData.tagline;
        }
        if (tmdbData.overview) {
          title.overview = tmdbData.overview;
        }
        if (tmdbData.runtime) {
          title.runtime = tmdbData.runtime;
        }
      }

      const traktGenres = traktData?.genres || [];
      const tmdbGenres =
        tmdbData?.genres
          ?.map((g) => g?.name?.toLowerCase())
          .filter((g) => !!g) || [];
      const useGenres =
        tmdbGenres.length > traktGenres.length ? tmdbGenres : traktGenres;

      await title.genres.init();
      title.genres.removeAll();
      for (const slug of useGenres) {
        const genre = await genreRepo.findOne({ slug });
        if (genre) {
          title.genres.add(genre);
        }
      }

      await em.begin();
      try {
        em.persist(title);
        await em.commit();
        this.logger.debug(
          `Updated metadata(${title.id}): ${title.name} (${title.year})`,
        );
        found = true;
      } catch {
        await em.rollback();
      }
    }

    if (!found) {
      this.logger.debug(
        `No metadata found(${title.id}): ${title.name} (${title.year})`,
      );
    }

    em.clear();
    return found;
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  public async checkMissingMetadata(): Promise<void> {
    const runnerName = "checkMissingMetadata";
    if (this.runners.has(runnerName)) {
      return;
    }

    const em = this.em.fork();
    const titleRepo = em.getRepository(TitleEntity);

    this.runners.add(runnerName);
    this.logger.info("Checking for missing metadata...");
    try {
      const titles = await titleRepo.findAll(["genres", "credits"]);
      for (const title of titles) {
        if (title.idTrakt) {
          await title.genres.init();
          if (!title.overview || title.genres.length === 0) {
            const task = await this.tasks.createTask({
              type: TaskType.METADATA,
              ref: title.id,
              priority: 2,
            });
            if (task) {
              this.logger.debug(`Created metadata task for ${title.id}`);
            }
          }
          await title.credits.init();
          if (title.credits.length === 0) {
            const task = await this.tasks.createTask({
              type: TaskType.CREDITS,
              ref: title.id,
              priority: 1,
            });
            if (task) {
              this.logger.debug(`Created credits task for ${title.id}`);
            }
          }
        }
      }
    } catch (e) {
      this.logger.error(e, "Failed to check for missing metadata");
    }

    try {
      await em.flush();
    } catch (e) {
      this.logger.error(e);
    }
    this.runners.delete(runnerName);

    // Kick off the task runner
    this.runTasks();
  }

  public async queueMetadataUpdate(titleId: string): Promise<boolean> {
    const em = this.em.fork(false);
    const count = await em.count(TitleEntity, titleId);
    if (count === 0) {
      throw Error("Title not found");
    }

    const task = await this.tasks.createTask({
      type: TaskType.METADATA,
      ref: titleId,
      priority: 10,
    });

    if (task) {
      this.logger.debug(`Queued metadata update for title(${titleId})`);
      this.runTasks();
    }

    return !!task;
  }
}
