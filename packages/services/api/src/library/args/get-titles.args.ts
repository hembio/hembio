import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { PaginationArgs } from "~/common/args/pagination.args";

@InputType()
export class GenreFilterInput {
  @Field(() => String)
  public slug!: string;
  @Field(() => Number)
  public value!: number;
}

@InputType()
export class FilterInput {
  @Field(() => [Int, Int])
  public year?: [number, number];

  @Field(() => [GenreFilterInput])
  public genre?: GenreFilterInput[];
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
