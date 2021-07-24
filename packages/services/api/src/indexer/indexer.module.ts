import { Module } from "@nestjs/common";
import { IndexerController } from "./indexer.controller";
import { IndexerService } from "./indexer.service";
import { EventModule } from "~/event/event.module";
import { getServiceClientProxy } from "~/utils/getServiceClientProxy";

const IndexerClientProxy = getServiceClientProxy("indexer");

@Module({
  imports: [EventModule],
  controllers: [IndexerController],
  providers: [IndexerClientProxy, IndexerService],
  exports: [IndexerClientProxy, IndexerService],
})
export class IndexerModule {}
