import { GenreEntity } from "@hembio/core";
import { Query, Resolver } from "@nestjs/graphql";
import { GenreService } from "./genre.service";

@Resolver()
export class GenreResolver {
  public constructor(public readonly genreService: GenreService) {}

  @Query(() => [GenreEntity], { name: "genres" })
  public getGenres(): Promise<GenreEntity[]> {
    return this.genreService.findAll();
  }
}
