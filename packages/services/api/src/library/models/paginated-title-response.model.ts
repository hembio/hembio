import { TitleEntity } from "@hembio/core";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PaginatedTitleResponse {
  @Field(() => [TitleEntity])
  public edges: TitleEntity[] = [];

  @Field(() => Int)
  public totalCount = 0;
}
