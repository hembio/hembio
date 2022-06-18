import { MikroORMConfig, MikroOrmModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { config } from "../../../../config";
import { TranscoderService } from "./transcoder.service";

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
  ],
  providers: [TranscoderService],
})
export class TranscoderModule {}
