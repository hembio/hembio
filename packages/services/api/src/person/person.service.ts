import { EntityManager, PersonEntity } from "@hembio/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PersonService {
  public constructor(private readonly em: EntityManager) {}

  public async findOneById(id: string): Promise<PersonEntity | null> {
    const em = this.em.fork(true);
    const person = await em.findOne(PersonEntity, id, {
      populate: ["credits", "credits.title"],
    });
    if (person) {
      await person.credits.init({
        orderBy: { title: { releaseDate: "DESC", year: "DESC" } },
      });
      return person;
    }
    return null;
  }
}
