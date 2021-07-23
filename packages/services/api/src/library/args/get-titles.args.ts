import { ArgsType, Field, Int } from "@nestjs/graphql";
import { PaginationArgs } from "~/common/args/pagination.args";

@ArgsType()
export class GetTitleArgs extends PaginationArgs {
  @Field(() => [String], { nullable: true })
  public ids?: string[];

  @Field({ nullable: true })
  public name?: string;

  @Field(() => Int, { nullable: true })
  public year?: number;

  @Field(() => String, { nullable: true })
  public orderBy?: string;

  @Field(() => String, { nullable: true })
  public orderDirection?: string;
}
