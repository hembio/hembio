import {
  MikroORM,
  QueryOrder,
  RequiredEntityData,
  UseRequestContext,
} from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { TaskEntity, TaskType } from "../../entities/TaskEntity";

interface CreateTask extends RequiredEntityData<TaskEntity> {
  type: TaskType;
  ref: string;
}

@Injectable()
export class TaskService {
  public constructor(
    @InjectPinoLogger(TaskService.name)
    private readonly logger: PinoLogger,
    private readonly orm: MikroORM,
  ) {}

  public async getTasks(
    type: TaskType | TaskType[],
    limit = 10,
  ): Promise<TaskEntity[]> {
    const em = this.orm.em.fork();
    const taskRepo = em.getRepository(TaskEntity);
    try {
      return await taskRepo.find(
        {
          type,
          waitUntil: { $lte: new Date() },
        },
        {
          orderBy: { priority: QueryOrder.DESC, createdAt: QueryOrder.ASC },
          limit,
        },
      );
    } catch {
      return [];
    }
  }

  public async getTasksForRef(
    type: TaskType,
    ref: string,
  ): Promise<TaskEntity[]> {
    const em = this.orm.em.fork();
    const taskRepo = em.getRepository(TaskEntity);
    try {
      return await taskRepo.find({ type, ref });
    } catch (e) {
      // this.logger.debug(e);
      return [];
    }
  }

  public async waitUntil(task: TaskEntity, until: Date): Promise<void> {
    const em = this.orm.em.fork();
    const taskRepo = em.getRepository(TaskEntity);
    task.waitUntil = until;
    task.priority = 0;
    try {
      return await taskRepo.persistAndFlush(task);
    } catch {
      return;
    }
  }

  public async createTask(
    data: CreateTask,
    noCheck = false,
  ): Promise<TaskEntity | undefined> {
    const em = this.orm.em.fork();
    const taskRepo = em.getRepository(TaskEntity);
    try {
      if (!noCheck) {
        const existingTasks = await this.getTasksForRef(data.type, data.ref);
        if (existingTasks.length > 0) {
          if (data.priority) {
            for (const existingTask of existingTasks) {
              if (data.waitUntil) {
                existingTask.waitUntil = data.waitUntil;
              }
              existingTask.priority = data.priority;
              await taskRepo.persistAndFlush(existingTask);
            }
          }
          // Task is already in queue for ref, return the first one
          return existingTasks[0];
        }
      }
      const task = taskRepo.create(data);
      await taskRepo.persistAndFlush(task);
      return task;
    } catch (e) {
      // this.logger.debug(e);
      return;
    }
  }

  @UseRequestContext()
  public async deleteTask(task: TaskEntity): Promise<void> {
    const em = this.orm.em.fork();
    const taskRepo = em.getRepository(TaskEntity);
    try {
      return await taskRepo.removeAndFlush(task);
    } catch {
      return;
    }
  }
}
