import { Module } from "@nestjs/common";
import { TranscoderController } from "./transcoder.controller";
import { getServiceProvider } from "~/utils/getServiceProvider";

@Module({
  controllers: [TranscoderController],
  providers: [getServiceProvider("transcoder")],
})
export class TranscoderModule {}
