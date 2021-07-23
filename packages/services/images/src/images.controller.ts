import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ImagesService } from "./images.service";

@Controller("images")
export class ImagesController {
  public constructor(private readonly imagesService: ImagesService) {}

  @MessagePattern({ cmd: "downloadBestVersions" })
  public async downloadBestVersions({ id }: { id: string }): Promise<unknown> {
    return this.imagesService.downloadTitleImages(id);
  }
}
