import { Module } from "@nestjs/common";
import { FileResolver } from "./file.resolver";
import { FileService } from "./file.service";
import { IndexerModule } from "~/indexer/indexer.module";

@Module({
  imports: [IndexerModule],
  providers: [FileResolver, FileService],
  exports: [FileService],
})
export class FileModule {}
