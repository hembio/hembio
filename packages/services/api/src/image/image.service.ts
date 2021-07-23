import { existsSync, Stats } from "fs";
import { stat } from "fs/promises";
import path from "path";
import {
  getCwd,
  TitleEntity,
  InjectRepository,
  EntityRepository,
} from "@hembio/core";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

interface GetImageResult {
  code?: number;
  error?: string;
  mime?: string;
  image?: string;
  stats?: Stats;
}

@Injectable()
export class ImageService {
  public constructor(
    @Inject("IMAGES_SERVICE")
    private readonly imagesClient: ClientProxy,
    @InjectRepository(TitleEntity)
    private readonly titleRepo: EntityRepository<TitleEntity>,
  ) {}

  public async getImage(id: string, type: string): Promise<GetImageResult> {
    const imgDir = path.resolve(getCwd(), ".images/titles");
    const title = await this.titleRepo.findOne(id);
    if (!title) {
      return { code: 404, error: "Title does not exist" };
    }

    try {
      // TODO: THIS IS UNSAFE! Need to check against valid types
      const image = path.join(imgDir, title.id, `${type}.jpg`);
      const exists = existsSync(image);
      if (exists) {
        return { mime: "image/jpeg", image, stats: await stat(image) };
      }
    } catch (e) {
      // res.status(404).send();
      // return;
    }

    if (!title.externalIds.imdb) {
      return { code: 404, error: "Title is missing iMDB" };
    }

    return { code: 404, error: "Image not found" };
  }

  public downloadImages(id: string): Observable<Record<string, unknown>> {
    return this.imagesClient.send({ cmd: "downloadBestVersions" }, { id });
  }
}
