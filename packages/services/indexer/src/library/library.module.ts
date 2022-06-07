import { TaskModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { MetadataModule } from "~/metadata/metadata.module";
import { LibraryService } from "./library.service";

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule, MetadataModule],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
