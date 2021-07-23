import { TaskType, EntityManager, TaskService } from "@hembio/core";
import { createLogger } from "@hembio/logger";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class MetadataService {
  private isRunning = false;
  private readonly logger = createLogger("metadata");

  public constructor(
    private readonly tasks: TaskService,
    private readonly em: EntityManager,
  ) {}

  @Cron("*/10 * * * * *")
  private async checkQueue() {
    // Early out when already running
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    const tasks = await this.tasks.getTasks(TaskType.METADATA);
    // do something with tasks
    this.isRunning = false;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  private async checkMissingMetadata(): Promise<void> {
    // NOT IMPLEMENTED
  }
}
