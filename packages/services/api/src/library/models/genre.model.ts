import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GenreModel {
  @Field(() => ID)
  public id!: number;
  @Field(() => String)
  public slug!: string;
}
