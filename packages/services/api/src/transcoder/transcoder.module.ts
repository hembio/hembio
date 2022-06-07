import { Module } from "@nestjs/common";
import { getServiceClientProxy } from "~/utils/getServiceClientProxy";
import { TranscoderController } from "./transcoder.controller";

const TranscoderClientProxy = getServiceClientProxy("transcoder");

@Module({
  controllers: [TranscoderController],
  providers: [TranscoderClientProxy],
})
export class TranscoderModule {}
