import { TaskModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ProbeService } from "./probe.service";

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule],
  providers: [ProbeService],
  exports: [ProbeService],
})
export class ProbeModule {}
