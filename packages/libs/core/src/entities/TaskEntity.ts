import {
  BeforeCreate,
  Entity,
  Enum,
  Filter,
  Index,
  JsonType,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { ID, Field, ObjectType, Int } from "@nestjs/graphql";
import { generateUuid } from "~/utils/generateUuid";

export enum TaskType {
  METADATA = "metadata",
  IMAGES = "images",
  INDEXER = "indexer",
  CREDITS = "credits",
}

@ObjectType()
@Index({ properties: ["type", "ref"] })
@Entity({ tableName: "task_queue" })
@Filter({
  name: "waitUntil",
  cond: () => ({ waitUntil: { $lte: new Date() } }),
  args: false,
})
export class TaskEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => Date)
  @Index()
  @Property({ nullable: false })
  public createdAt = new Date();

  @Field(() => Date)
  @Index()
  @Property({ nullable: false })
  public waitUntil = new Date();

  @Field(() => TaskType)
  @Index()
  @Enum()
  public type!: TaskType;

  @Field(() => Int)
  @Property({ nullable: false })
  public priority = 0;

  @Field()
  @Property({ nullable: false })
  public ref!: string;

  @Field(() => Object)
  @Property({ type: JsonType, nullable: false })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public payload: Record<string, any> = {};

  @BeforeCreate()
  public async beforeCreate(): Promise<void> {
    this.id = generateUuid();
    this.createdAt = new Date();
  }
}
