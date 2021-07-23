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
import { CreditsService } from "./credits.service";

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
  providers: [CreditsService],
  exports: [CreditsService],
})
export class CreditsModule {}
