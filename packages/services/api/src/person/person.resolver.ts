import { Query, Resolver, Args } from "@nestjs/graphql";
import { PersonEntity } from "../../../../libs/core/src";
import { PersonService } from "./person.service";

@Resolver()
export class PersonResolver {
  public constructor(private readonly personService: PersonService) {}

  @Query(() => PersonEntity, { name: "person", nullable: true })
  public getPerson(@Args("id") id: string): Promise<PersonEntity | null> {
    return this.personService.findOneById(id);
  }
}
