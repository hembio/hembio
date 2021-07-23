import { createService } from "@hembio/core";
import { IndexerModule } from "./indexer.module";

createService("indexer", IndexerModule);
