import {
  TaskModule,
  MikroORMConfig,
  MikroOrmModule,
  TaskEntity,
} from "@hembio/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { config } from "../../../../config";
import { MetadataController } from "./metadata.controller";
import { MetadataService } from "./metadata.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    MikroOrmModule.forRoot(MikroORMConfig),
    MikroOrmModule.forFeature([TaskEntity]),
    ScheduleModule.forRoot(),
    TaskModule,
  ],
  providers: [MetadataService],
  controllers: [MetadataController],
})
export class MetadataModule {}
