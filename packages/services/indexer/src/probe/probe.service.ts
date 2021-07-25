import path from "path";
import { EntityManager, FileEntity } from "@hembio/core";
import { FFprobeResult, probe } from "@hembio/ffmpeg";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProbeService {
  public constructor(private readonly em: EntityManager) {}

  public async probeFile(fileId: string): Promise<FFprobeResult> {
    const em = this.em.fork();
    const file = await em.findOneOrFail(FileEntity, fileId, ["library"]);
    const filePath = path.join(file.library.path, file.path);
    const result = await probe(filePath);
    return result;
  }
}
