import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UpdateMutationModel {
  @Field(() => String, { nullable: true })
  public id?: string;
}
