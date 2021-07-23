import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StatsModel {
  @Field(() => Int)
  public time?: number;

  @Field(() => Int)
  public uptime?: number;

  @Field(() => Int)
  public cpuUsage?: number;

  @Field(() => Int)
  public totalMem?: number;

  @Field(() => Int)
  public freeMem?: number;

  @Field(() => Int)
  public totalFiles?: number;

  @Field(() => Int)
  public totalTitles?: number;
}
