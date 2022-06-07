import path from "path";
import {
  EntityManager,
  FileEntity,
  LibraryEntity,
  TitleEntity,
} from "@hembio/core";
import { createLogger } from "@hembio/logger";
import { Injectable } from "@nestjs/common";
import chokidar from "chokidar";
import { LibraryService } from "~/library/library.service";

@Injectable()
export class WatcherService {
  private logger = createLogger("indexer");
  public constructor(
    private readonly em: EntityManager,
    private readonly libraryService: LibraryService,
  ) {
    this.watchLibraries();
  }

  public async watchLibraries(): Promise<void> {
    const em = this.em.fork();
    const libraryRepo = em.getRepository(LibraryEntity);
    const libraries = await libraryRepo.findAll();

    for (const library of libraries) {
      if (library.watch) {
        chokidar
          .watch(library.path, {
            usePolling: true,
            interval: 60000,
            binaryInterval: 60000,
            depth: 2,
            ignoreInitial: true,
          })
          .on("addDir", (addedDir) => {
            this.logger.debug(`Detected new directory: ${addedDir}`);
          })
          .on("add", async (addedFile) => {
            if (library.matcherRegEx.test(addedFile)) {
              this.logger.debug(`Detected new file: ${addedFile}`);
              await this.libraryService.checkPath(
                library,
                path.dirname(addedFile),
              );
            }
          })
          .on("unlinkDir", async (removedDir) => {
            this.logger.debug(`Detected directory unlink: ${removedDir}`);
            const em = this.em.fork();
            const relPath = path.relative(library.path, removedDir);
            const found = await em.findOne(TitleEntity, { path: relPath });
            if (found) {
              try {
                await em.removeAndFlush(found);
              } catch {
                // Ignore
              }
            }
          })
          .on("unlink", async (removedFile) => {
            if (library.matcherRegEx.test(removedFile)) {
              const em = this.em.fork();
              this.logger.debug(`Detected file unlink: ${removedFile}`);
              const relPath = path.relative(library.path, removedFile);
              const found = await em.findOne(FileEntity, { path: relPath });
              if (found) {
                try {
                  await em.removeAndFlush(found);
                } catch {
                  // Ignore
                }
              }
            }
          })
          .on("ready", () => {
            this.logger.debug(`Watching for file changes in ${library.path}`);
          });
      }
    }
  }
}
