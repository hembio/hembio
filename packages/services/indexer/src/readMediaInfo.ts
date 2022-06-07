import fs from "fs";
import path from "path";
import { FileLRU, getCwd, FileEntity } from "@hembio/core";
import { createLogger } from "@hembio/logger";
import { mediainfo, MediaInfo } from "@hembio/mediainfo";
import PQueue from "p-queue";

const logger = createLogger("mediainfo");

interface CachePayload {
  stat: { mtimeMs: number; size: number };
  result: MediaInfo;
}

const queue = new PQueue({ concurrency: 1, autoStart: true });
const cache = new FileLRU<CachePayload>(
  path.join(getCwd(), "./.cache/mediainfo.json"),
  1024,
);

export async function readMediaInfo(
  basePath: string,
  file: FileEntity,
): Promise<MediaInfo | undefined> {
  const fullPath = path.join(basePath, file.path);
  const task = async (): Promise<MediaInfo | undefined> => {
    const stat = await fs.promises.lstat(fullPath);
    let result: MediaInfo | undefined = undefined;
    const cached = cache.get(fullPath);
    if (
      cached &&
      cached.stat.mtimeMs === stat.mtimeMs &&
      cached.stat.size === stat.size
    ) {
      result = cached.result;
    } else {
      // Invalidate cache
      cache.delete(fullPath);
    }

    if (!result) {
      logger.debug(`Reading mediainfo from ${file.path}`);
      try {
        result = await mediainfo(fullPath);
        cache.set(fullPath, {
          stat: {
            size: stat.size,
            mtimeMs: stat.mtimeMs,
          },
          result,
        });
      } catch (e) {
        logger.error(e);
      }
    }
    return result;
  };
  return queue.add(task);
}
