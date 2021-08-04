import { CreditEntity } from "@hembio/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CreditsByTitle {
  @Field(() => ID)
  public id!: string;
  @Field(() => String)
  public name!: string;
  @Field(() => Number)
  public year!: number;
  @Field(() => String, { nullable: true })
  public thumb?: string;
  @Field(() => [CreditEntity])
  public credits: CreditEntity[] = [];
}
