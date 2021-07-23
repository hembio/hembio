import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DeleteModel {
  @Field(() => String, { nullable: true })
  public id?: string;
}
