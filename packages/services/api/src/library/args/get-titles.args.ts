import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { PaginationArgs } from "~/common/args/pagination.args";

@InputType()
export class FilterInput {
  @Field(() => [Int, Int], { nullable: true })
  public year?: [number, number];

  @Field(() => GraphQLJSON, { nullable: true })
  public genre?: string;
}

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

  @Field(() => FilterInput, { nullable: true })
  public filter?: FilterInput;
}
