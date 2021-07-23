import { TaskModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { MetadataService } from "./metadata.service";

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
