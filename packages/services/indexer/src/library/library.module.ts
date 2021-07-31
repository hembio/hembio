import { TaskModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { LibraryService } from "./library.service";
import { MetadataModule } from "~/metadata/metadata.module";

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule, MetadataModule],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
