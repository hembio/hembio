import { createReadStream, ReadStream, Stats } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Transform } from "stream";
import { EntityManager, FileEntity, LibraryEntity } from "@hembio/core";
import { createLogger } from "@hembio/logger";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { parse, stringify } from "subtitle";

@Injectable()
export class StreamService {
  private readonly logger = createLogger("stream");
  public constructor(private readonly em: EntityManager) {}

  public async getVideoStream(fileId: string, offset = 0): Promise<any> {
    const em = this.em.fork(false);
    const file = await em.findOneOrFail(FileEntity, fileId, {
      fields: ["id", "library", "path"],
      populate: ["library"],
    });
    console.log(`Getting video stream for ${file.path}`);
    return;
  }

  public async getAudioStream(fileId: string, offset = 0): Promise<any> {
    const em = this.em.fork(false);
    const file = await em.findOneOrFail(FileEntity, fileId, {
      fields: ["id", "library", "path"],
      populate: ["library"],
    });
    console.log(`Getting audio stream for ${file.path}`);
    return;
  }

  public async statFile(fileId: string): Promise<Stats> {
    const em = this.em.fork(false);
    const file = await em.findOneOrFail(FileEntity, fileId, {
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
    const em = this.em.fork(false);
    const file = await em.findOneOrFail(FileEntity, fileId, {
      fields: ["id", "library.path", "path"],
    });

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

    // try {
    //   // Attempt to extract subtitles
    //   const ffmpeg = new FFmpeg();
    //   const filePath = path.join(file.title.library.path, file.path);
    //   const vttFile = tempfile(".vtt");
    //   ffmpeg.setInput(filePath);
    //   ffmpeg.setGlobalOptions(["-y"]);
    //   ffmpeg.setOutputOptions(["-f webvtt"]);
    //   ffmpeg.setOutput(vttFile);
    //   ffmpeg.run();

    //   return new Promise((resolve, reject) => {
    //     ffmpeg.on("error", (e) => {
    //       this.logger.error(e);
    //       reject(e);
    //     });

    //     ffmpeg.on("done", () => {
    //       const readStream = createReadStream(vttFile);
    //       readStream.on("close", async () => {
    //         await unlink(vttFile);
    //       });
    //       resolve(readStream);
    //     });
    //   });
    // } catch (e) {
    //   this.logger.error(e);
    //   throw e;
    // }

    throw new NotFoundException("Subtitle not found");
  }
}
