import { TaskModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { CreditsService } from "./credits.service";

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule],
  providers: [CreditsService],
  exports: [CreditsService],
})
export class CreditsModule {}
