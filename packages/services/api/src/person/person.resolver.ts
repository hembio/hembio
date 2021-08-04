import { PersonEntity } from "@hembio/core";
import {
  Query,
  Resolver,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { CreditsByTitle } from "./models/credits-by-title.model";
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

  @ResolveField(() => [CreditsByTitle], {
    name: "creditsByTitle",
    nullable: true,
  })
  public async getCreditsByTitle(
    @Parent() person: PersonEntity,
  ): Promise<CreditsByTitle[]> {
    const titles = new Map<string, CreditsByTitle>();
    const credits = (await person.credits.init()).getItems();
    for (const credit of credits) {
      const title = credit.title;
      const entry = titles.get(title.id) || new CreditsByTitle();
      titles.set(title.id, { ...title, credits: [...entry.credits, credit] });
    }
    return Array.from(titles.values()).sort((a, b) => b.year - a.year);
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
