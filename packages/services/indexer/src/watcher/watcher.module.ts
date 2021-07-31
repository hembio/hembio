import { Module } from "@nestjs/common";
import { WatcherService } from "./watcher.service";
import { LibraryModule } from "~/library/library.module";

@Module({
  imports: [LibraryModule],
  providers: [WatcherService],
  exports: [WatcherService],
})
export class WatcherModule {}
