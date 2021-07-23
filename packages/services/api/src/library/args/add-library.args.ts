import { LibraryType } from "@hembio/core";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class AddLibraryArgs {
  @Field(() => String)
  public name!: string;

  @Field(() => LibraryType)
  public type!: LibraryType;

  @Field(() => String)
  public path!: string;
}
