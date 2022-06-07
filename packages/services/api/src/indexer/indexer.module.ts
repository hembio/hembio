import { Module } from "@nestjs/common";
import { EventModule } from "~/event/event.module";
import { getServiceClientProxy } from "~/utils/getServiceClientProxy";
import { IndexerController } from "./indexer.controller";
import { IndexerService } from "./indexer.service";

const IndexerClientProxy = getServiceClientProxy("indexer");

@Module({
  imports: [EventModule],
  controllers: [IndexerController],
  providers: [IndexerClientProxy, IndexerService],
  exports: [IndexerClientProxy, IndexerService],
})
export class IndexerModule {}
