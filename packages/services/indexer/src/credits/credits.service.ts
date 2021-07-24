import {
  MikroORM,
  TaskEntity,
  EntityManager,
  TaskService,
  TaskType,
  Times,
  TitleEntity,
  PersonEntity,
  CreditEntity,
} from "@hembio/core";
import { createLogger } from "@hembio/logger";
import { TMDbProvider, TraktProvider } from "@hembio/metadata";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Cast, Crew } from "moviedb-promise/dist/request-types";
import PQueue from "p-queue";

@Injectable()
export class CreditsService {
  private logger = createLogger("credits");
  private trakt = new TraktProvider();
  private tmdb = new TMDbProvider();
  private runners = new Set<string>();

  public taskQueue = new PQueue({
    concurrency: 3,
  });

  // Stay within the rate limit of TMDb
  private readonly creditsFetchQueue = new PQueue({
    concurrency: 6,
    intervalCap: 12,
    interval: 1000,
    carryoverConcurrencyCount: true,
  });

  public constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly tasks: TaskService,
  ) {
    // setTimeout(async () => {
    //   await this.orm.isConnected();
    //   await this.checkMissingCredits();
    //   await this.runTasks();
    // }, 1000);
  }

  public async checkMissingCredits(): Promise<void> {
    // TODO: Implement
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async runTasks(tasks?: TaskEntity[]): Promise<void> {
    const runnerName = `runTasks`;
    if (this.runners.has(runnerName)) {
      this.logger.debug("Credits tasks are already running");
      return;
    }
    this.runners.add(runnerName);

    try {
      if (!tasks) {
        tasks = await this.tasks.getTasks(TaskType.CREDITS, 3);
      }
      if (tasks.length > 0) {
        this.logger.debug(`Running ${tasks.length} credits tasks`);
        for (const task of tasks) {
          const { ref } = task;
          this.taskQueue.add(async () => {
            try {
              const found = await this.lookupCredits(ref);
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
      }
    } catch (e) {
      this.logger.error(e);
    }

    await this.taskQueue.onIdle();
    this.runners.delete(runnerName);

    let nextTasks: TaskEntity[] = [];
    try {
      nextTasks = await this.tasks.getTasks([TaskType.CREDITS], 3);
    } catch (e) {
      this.logger.error(e);
    }

    if (nextTasks.length > 0) {
      this.runTasks(nextTasks);
    }
  }

  public async lookupCredits(titleId: string): Promise<boolean> {
    const em = this.em.fork(false);
    const titleRepo = em.getRepository(TitleEntity);
    const title = await titleRepo.findOne(titleId);

    if (!title) {
      throw Error(`Title ${titleId} not found`);
    }

    if (!title.idTmdb) {
      return false;
    }

    this.logger.debug(
      `Looking up credits(${title.id}): ${title.name} (${title.year})`,
    );
    const data = await this.tmdb.credits(title.type, title.idTmdb);

    if (!data) {
      this.logger.debug(
        `No credits found(${title.id}): ${title.name} (${title.year})`,
      );
    }

    if (data && (data.cast || data.crew)) {
      let updated = false;

      try {
        await title.credits.init();
        // For some reason title.credits.removeAll() doesn't work
        for (const credit of title.credits) {
          em.remove(credit);
        }
        await em.persistAndFlush(title);
        this.logger.debug(
          `Cleared credits(${title.id}): ${title.name} (${title.year})`,
        );
        updated = true;
      } catch {
        this.logger.debug(
          `Failed to clear credits(${title.id}): ${title.name} (${title.year})`,
        );
        return false;
      }

      const castAndCrew = [...(data.cast || []), ...(data.crew || [])].flat();
      for (const cast of castAndCrew) {
        this.creditsFetchQueue.add(async () => {
          if (!cast.id) {
            return;
          }

          const em = this.em.fork(false);
          const personRepo = em.getRepository(PersonEntity);
          const creditRepo = em.getRepository(CreditEntity);

          // this.logger.debug("Find existing person");
          let person = await personRepo.findOne({
            idTmdb: cast.id,
          });
          if (!person) {
            // this.logger.debug("Create new person");
            const personInfo = await this.tmdb.person(cast.id);
            if (!personInfo) {
              this.logger.debug(`No info found for person(${cast.id})`);
              return;
            }
            person = personRepo.create({
              idTmdb: personInfo.id,
              idImdb: personInfo.imdb_id,
              name: personInfo.name,
              birthday: personInfo.birthday,
              placeOfBirth: personInfo.place_of_birth,
              bio: personInfo.biography,
            });

            try {
              await em.persistAndFlush(person);
              this.logger.debug(`Added person(${person.id}): ${person.name}`);
            } catch {
              this.logger.debug(
                `Failed to add person(${person.id}): ${person.name}`,
              );
              // Person probably already exists
              person = await personRepo.findOne({
                idTmdb: cast.id,
              });
            }
          }

          // this.logger.debug({ person });
          const { character, order } = cast as Cast;
          const { job } = cast as Crew;

          const department = cast.known_for_department;

          if (person) {
            const existingCredit = await creditRepo.findOne({
              title,
              person,
              job: job || "Actor",
              character,
            });
            if (existingCredit) {
              existingCredit.order = order !== undefined ? order : undefined;
              await em.begin();
              try {
                await em.persistAndFlush(existingCredit);
                updated = true;
              } catch (e) {
                this.logger.error(e);
              }
              return;
            }

            const credit = creditRepo.create({
              title,
              person,
              order: order,
              job: job || "Actor",
              character,
              department,
            });
            try {
              title.credits.add(credit);
              await em.persistAndFlush(title);
              this.logger.debug(
                `Added credits(${title.id}): ${person.name} (${credit.job})`,
              );
              updated = true;
            } catch {
              // Credit probably already exists
            }
          }
        });
      }

      await this.creditsFetchQueue.onIdle();
      if (updated) {
        this.logger.debug(
          `Updated credits(${title.id}): ${title.name} (${title.year})`,
        );
      }
      return updated;
    }
    return false;
  }

  public async queueCreditsUpdate(titleId: string): Promise<boolean> {
    const em = this.em.fork(false);
    const count = await em.count(TitleEntity, titleId);
    if (count === 0) {
      throw Error("Title not found");
    }

    const task = await this.tasks.createTask({
      type: TaskType.CREDITS,
      ref: titleId,
      priority: 10,
    });

    if (task) {
      this.logger.debug(`Queued credits update for title(${titleId})`);
    }

    return !!task;
  }
}
