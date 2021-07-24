import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ImagesService } from "./images.service";

@Controller("images")
export class ImagesController {
  public constructor(private readonly imagesService: ImagesService) {}

  @MessagePattern({ cmd: "updateTitleImages" })
  public updateMetadata({ titleId }: { titleId: string }): Promise<boolean> {
    return this.imagesService.queueTitleImagesUpdate(titleId);
  }

  @MessagePattern({ cmd: "updatePersonImages" })
  public async updatePersonImages({
    personId,
  }: {
    personId: string;
  }): Promise<unknown> {
    return this.imagesService.queuePersonImageUpdate(personId);
  }
}
