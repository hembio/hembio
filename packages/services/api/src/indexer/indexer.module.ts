import { Module } from "@nestjs/common";
import { IndexerController } from "./indexer.controller";
import { IndexerService } from "./indexer.service";
import { EventModule } from "~/event/event.module";
import { getServiceProvider } from "~/utils/getServiceProvider";

@Module({
  imports: [EventModule],
  controllers: [IndexerController],
  providers: [getServiceProvider("indexer"), IndexerService],
  exports: [IndexerService],
})
export class IndexerModule {}
