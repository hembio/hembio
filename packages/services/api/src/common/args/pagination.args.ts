import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Min, Max } from "class-validator";

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  @Min(0)
  public skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(100)
  public take = 50;
}
