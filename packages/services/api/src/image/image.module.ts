import { MikroOrmModule, TitleEntity } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { ImageResolver } from "./image.resolver";
import { ImageService } from "./image.service";
import { getServiceProvider } from "~/utils/getServiceProvider";

@Module({
  imports: [MikroOrmModule.forFeature([TitleEntity])],
  controllers: [ImageController],
  providers: [getServiceProvider("images"), ImageService, ImageResolver],
  exports: [ImageService],
})
export class ImageModule {}
