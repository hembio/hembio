import { MikroOrmModule, TitleEntity } from "@hembio/core";
import { Module } from "@nestjs/common";
import { getServiceClientProxy } from "~/utils/getServiceClientProxy";
import { ImageController } from "./image.controller";
import { ImageResolver } from "./image.resolver";
import { ImageService } from "./image.service";

const ImagesClientProxy = getServiceClientProxy("images");

@Module({
  imports: [MikroOrmModule.forFeature([TitleEntity])],
  controllers: [ImageController],
  providers: [ImagesClientProxy, ImageService, ImageResolver],
  exports: [ImageService],
})
export class ImageModule {}
