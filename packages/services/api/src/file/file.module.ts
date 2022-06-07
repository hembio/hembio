import { Module } from "@nestjs/common";
import { IndexerModule } from "~/indexer/indexer.module";
import { FileResolver } from "./file.resolver";
import { FileService } from "./file.service";

@Module({
  imports: [IndexerModule],
  providers: [FileResolver, FileService],
  exports: [FileService],
})
export class FileModule {}
