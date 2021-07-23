import { MikroORMConfig, MikroOrmModule, TaskModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { config } from "../../../../config";
import { CreditsModule } from "./credits/credits.module";
import { IndexerController } from "./indexer.controller";
import { IndexerService } from "./indexer.service";
import { MetadataModule } from "./metadata/metadata.module";
import { ProbeModule } from "./probe/probe.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    MikroOrmModule.forRoot(MikroORMConfig),
    ScheduleModule.forRoot(),
    TaskModule,
    MetadataModule,
    CreditsModule,
    ProbeModule,
  ],
  controllers: [IndexerController],
  providers: [IndexerService],
})
export class IndexerModule {}
