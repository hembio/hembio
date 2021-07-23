import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ImagesService } from "./images.service";

@Controller("images")
export class ImagesController {
  public constructor(private readonly imagesService: ImagesService) {}

  @MessagePattern({ cmd: "updateTitleImages" })
  public async updateTitleImages({ id }: { id: string }): Promise<unknown> {
    return this.imagesService.queueTitleImagesUpdate(id);
  }

  @MessagePattern({ cmd: "updatePersonImages" })
  public async updatePersonImages({ id }: { id: string }): Promise<unknown> {
    return this.imagesService.queuePersonImageUpdate(id);
  }
}
