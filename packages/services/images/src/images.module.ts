import { TaskModule, MikroOrmModule, MikroORMConfig } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerModule } from "nestjs-pino";
import { config } from "../../../../config";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: [
        {
          level: process.env.NODE_ENV !== "production" ? "debug" : "info",
          // install 'pino-pretty' package in order to use the following option
          transport:
            process.env.NODE_ENV !== "production"
              ? { target: "pino-pretty" }
              : undefined,
        },
        process.stdout,
      ],
    }),
    ConfigModule.forRoot({
      load: [config],
    }),
    MikroOrmModule.forRoot(MikroORMConfig),
    ScheduleModule.forRoot(),
    TaskModule,
  ],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
