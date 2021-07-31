import { MikroORM, QueryOrder } from "@mikro-orm/core";
import { UseRequestContext } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { TaskEntity, TaskType } from "../../entities/TaskEntity";

interface CreateTask {
  type: TaskType;
  ref: string;
  payload?: Record<string, unknown>;
  priority?: number;
}

@Injectable()
export class TaskService {
  // private readonly logger = createLogger("tasks");
  public constructor(private readonly orm: MikroORM) {}

  public async getTasks(
    type: TaskType | TaskType[],
    limit = 10,
  ): Promise<TaskEntity[]> {
    const em = this.orm.em.fork(false);
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
    const em = this.orm.em.fork(false);
    const taskRepo = em.getRepository(TaskEntity);
    try {
      return await taskRepo.find({ type, ref });
    } catch (e) {
      // this.logger.debug(e);
      return [];
    }
  }

  public async waitUntil(task: TaskEntity, until: Date): Promise<void> {
    const em = this.orm.em.fork(false);
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
    const em = this.orm.em.fork(false);
    const taskRepo = em.getRepository(TaskEntity);
    try {
      if (!noCheck) {
        const existingTasks = await this.getTasksForRef(data.type, data.ref);
        if (existingTasks.length > 0) {
          if (data.priority) {
            for (const existingTask of existingTasks) {
              if (existingTask.priority !== data.priority) {
                existingTask.priority = data.priority;
                await taskRepo.persistAndFlush(existingTask);
                return existingTask;
              }
            }
          }
          // Task is already in queue for ref
          return;
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
    const em = this.orm.em.fork(false);
    const taskRepo = em.getRepository(TaskEntity);
    try {
      return await taskRepo.removeAndFlush(task);
    } catch {
      return;
    }
  }
}
