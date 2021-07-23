import {
  TaskModule,
  MikroOrmModule,
  MikroORMConfig,
  PersonEntity,
  TitleEntity,
} from "@hembio/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { config } from "../../../../config";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    MikroOrmModule.forRoot(MikroORMConfig),
    MikroOrmModule.forFeature([TitleEntity, PersonEntity]),
    ScheduleModule.forRoot(),
    TaskModule,
  ],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
