import { MikroORMConfig, MikroOrmModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { config } from "../../../../config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CheckerModule } from "./checker/checker.module";
import { CreditsModule } from "./credits/credits.module";
import { LibraryModule } from "./library/library.module";
import { MetadataModule } from "./metadata/metadata.module";
import { ProbeModule } from "./probe/probe.module";
import { WatcherModule } from "./watcher/watcher.module";

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
    MetadataModule,
    CreditsModule,
    ProbeModule,
    WatcherModule,
    CheckerModule,
    LibraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
