import { Module } from "@nestjs/common";
import { TranscoderController } from "./transcoder.controller";
import { getServiceClientProxy } from "~/utils/getServiceClientProxy";

const TranscoderClientProxy = getServiceClientProxy("transcoder");

@Module({
  controllers: [TranscoderController],
  providers: [TranscoderClientProxy],
})
export class TranscoderModule {}
