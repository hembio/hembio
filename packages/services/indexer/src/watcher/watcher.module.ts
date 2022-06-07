import { Module } from "@nestjs/common";
import { LibraryModule } from "~/library/library.module";
import { WatcherService } from "./watcher.service";

@Module({
  imports: [LibraryModule],
  providers: [WatcherService],
  exports: [WatcherService],
})
export class WatcherModule {}
