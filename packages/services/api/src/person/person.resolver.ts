import { Query, Resolver, Args, Mutation } from "@nestjs/graphql";
import { PersonEntity } from "../../../../libs/core/src";
import { PersonService } from "./person.service";
import { UpdateMutationModel } from "~/common/models/update-mutation.model";
import { ImageService } from "~/image/image.service";

@Resolver(() => PersonEntity)
export class PersonResolver {
  public constructor(
    private readonly personService: PersonService,
    private readonly imageService: ImageService,
  ) {}

  @Query(() => PersonEntity, { name: "person", nullable: true })
  public getPerson(@Args("id") id: string): Promise<PersonEntity | null> {
    return this.personService.findOneById(id);
  }

  @Mutation(() => UpdateMutationModel)
  public async updatePersonImages(
    @Args({ name: "id", type: () => String }) id: string,
  ): Promise<UpdateMutationModel> {
    if (await this.imageService.updatePersonImages(id)) {
      return { id };
    }
    return {};
  }
}
