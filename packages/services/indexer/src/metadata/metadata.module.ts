import {
  CreditEntity,
  FileEntity,
  GenreEntity,
  LibraryEntity,
  MikroOrmModule,
  PersonEntity,
  TaskModule,
  TitleEntity,
} from "@hembio/core";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { MetadataService } from "./metadata.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([
      LibraryEntity,
      TitleEntity,
      FileEntity,
      GenreEntity,
      PersonEntity,
      CreditEntity,
    ]),
    ScheduleModule.forRoot(),
    TaskModule,
  ],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
