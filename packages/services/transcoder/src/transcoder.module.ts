import { MikroORMConfig, MikroOrmModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { config } from "../../../../config";
import { TranscoderService } from "./transcoder.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    MikroOrmModule.forRoot(MikroORMConfig),
  ],
  providers: [TranscoderService],
})
export class TranscoderModule {}
