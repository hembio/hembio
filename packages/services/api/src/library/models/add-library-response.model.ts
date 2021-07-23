import { LibraryEntity } from "@hembio/core";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AddLibraryResponse {
  @Field(() => LibraryEntity, { nullable: true })
  public library?: LibraryEntity;
}
