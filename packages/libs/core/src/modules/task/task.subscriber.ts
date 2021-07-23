import {
  EntityName,
  EventArgs,
  EventSubscriber,
  Subscriber,
} from "@mikro-orm/core";
import { TaskEntity } from "~/entities";

@Subscriber()
export class TaskSubscriber implements EventSubscriber<TaskEntity> {
  public getSubscribedEntities(): EntityName<TaskEntity>[] {
    return [TaskEntity];
  }

  public async afterCreate(_args: EventArgs<TaskEntity>): Promise<void> {
    // Not implemented
  }

  public async afterUpdate(_args: EventArgs<TaskEntity>): Promise<void> {
    // Not implemented
  }
}
