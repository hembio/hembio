import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UpdateCreditsModel {
  @Field(() => String, { nullable: true })
  public id?: string;
}
