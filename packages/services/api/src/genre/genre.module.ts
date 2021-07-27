import { Module } from "@nestjs/common";
import { GenreResolver } from "./genre.resolver";
import { GenreService } from "./genre.service";

@Module({
  providers: [GenreService, GenreResolver],
  exports: [GenreService],
})
export class GenreModule {}
