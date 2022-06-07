import { createReadStream, ReadStream, Stats } from "fs";
import { stat, unlink } from "fs/promises";
import path from "path";
import { Transform } from "stream";
import { EntityManager, FileEntity, getCwd, LibraryEntity } from "@hembio/core";
import { createLogger } from "@hembio/logger";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { FFmpeggy } from "ffmpeggy";
import { parse, stringify } from "subtitle";
import tempfile from "tempfile";

FFmpeggy.DefaultConfig = {
  ...FFmpeggy.DefaultConfig,
  overwriteExisting: true,
  ffmpegBin: path.join(getCwd(), "bin/win64/ffmpeg/ffmpeg.exe"),
  ffprobeBin: path.join(getCwd(), "bin/win64/ffmpeg/ffprobe.exe"),
};

@Injectable()
export class StreamService {
  private readonly logger = createLogger("stream");
  public constructor(private readonly em: EntityManager) {}

  public async getVideoStream(fileId: string, offset = 0): Promise<void> {
    const repo = this.em.fork().getRepository(FileEntity);
    const file = await repo.findOneOrFail(fileId, {
      fields: ["id", "library", "path"],
      populate: ["library"],
    });
    console.log(`Getting video stream for ${file.path}`);
    return;
  }

  public async getAudioStream(fileId: string, offset = 0): Promise<void> {
    const repo = this.em.fork().getRepository(FileEntity);
    const file = await repo.findOneOrFail(fileId, {
      fields: ["id", "library", "path"],
      populate: ["library"],
    });
    console.log(`Getting audio stream for ${file.path}`);
    return;
  }

  public async statFile(fileId: string): Promise<Stats> {
    const repo = this.em.fork().getRepository(FileEntity);
    const file = await repo.findOneOrFail(fileId, {
      fields: ["id", "library", "path"],
      populate: ["library"],
    });
    if (!file.library) {
      throw new InternalServerErrorException(
        "File is not connected to a library",
      );
    }
    const filePath = path.join(file.library.path, file.path);
    return await stat(filePath);
  }

  public async getFile(fileId: string): Promise<[string, Stats]> {
    const em = this.em.fork();
    const file = await em.findOneOrFail(FileEntity, fileId, {
      fields: ["id", "library", "path"],
    });
    const library = await em.findOneOrFail(LibraryEntity, file.library);

    const filePath = path.join(library.path, file.path);
    try {
      return [filePath, await stat(filePath)];
    } catch (e) {
      this.logger.error(e);
      throw new ServiceUnavailableException("Service unavailable");
    }
  }

  public async getSubtitle(
    fileId: string,
    language: string,
    external = true,
  ): Promise<Transform | ReadStream> {
    const em = this.em.fork();
    const file = await em.findOneOrFail(FileEntity, fileId, {
      populate: ["library"],
    });

    console.log("file", file);

    if (!file.library) {
      throw new InternalServerErrorException(
        "File is not connected to a library",
      );
    }

    if (external) {
      // Check for external subtitles
      const srtFile = path
        .join(file.library.path, file.path)
        .replace(path.extname(file.path), `.${language}.srt`);
      try {
        if (await stat(srtFile)) {
          const vtt = createReadStream(srtFile)
            .pipe(parse())
            .pipe(stringify({ format: "WebVTT" }));
          return vtt;
        }
      } catch {
        // Ignore
      }
    }

    try {
      // Attempt to extract subtitles
      const filePath = path.join(file.library.path, file.path);
      const vttFile = tempfile(".vtt");
      const ffmpeggy = new FFmpeggy({
        input: filePath,
        outputOptions: ["-map 0:s:0", "-f webvtt"],
        output: vttFile,
      });

      return new Promise((resolve, reject) => {
        ffmpeggy.on("error", (e) => {
          this.logger.error(e);
          reject(e);
        });

        ffmpeggy.on("start", (args) => {
          this.logger.debug(args, "ffmpeggy:start");
        });

        ffmpeggy.on("progress", (progress) => {
          this.logger.debug(progress, "ffmpeggy:progress");
        });

        ffmpeggy.on("done", () => {
          this.logger.debug("ffmpeggy:done");
          const readStream = createReadStream(vttFile);
          readStream.on("close", async () => {
            await unlink(vttFile);
          });
          resolve(readStream);
        });

        ffmpeggy.run();
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }

    throw new NotFoundException("Subtitle not found");
  }
}
