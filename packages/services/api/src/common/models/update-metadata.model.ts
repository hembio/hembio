import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UpdateMetadataModel {
  @Field(() => String, { nullable: true })
  public id?: string;
}
