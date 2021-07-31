import { createService } from "@hembio/core";
import { AppModule } from "./app.module";

createService("indexer", AppModule);
