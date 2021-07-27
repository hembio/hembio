import { EntityManager, GenreEntity } from "@hembio/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GenreService {
  public constructor(public readonly em: EntityManager) {}

  public async findAll(): Promise<GenreEntity[]> {
    return this.em.find(
      GenreEntity,
      {},
      { cache: true, orderBy: { name: "ASC" } },
    );
  }
}
