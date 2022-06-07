import path from "path";
import { EntityManager, FileEntity } from "@hembio/core";
import { Injectable } from "@nestjs/common";
import { FFprobeResult, FFmpeggy } from "ffmpeggy";

@Injectable()
export class ProbeService {
  public constructor(private readonly em: EntityManager) {}

  public async probeFile(fileId: string): Promise<FFprobeResult> {
    const em = this.em.fork();
    const file = await em.findOneOrFail(FileEntity, fileId, {
      populate: ["library"],
    });
    const filePath = path.join(file.library.path, file.path);
    const result = await FFmpeggy.probe(filePath);
    return result;
  }
}
