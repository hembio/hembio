import { createService } from "@hembio/core";
import { TranscoderModule } from "./transcoder.module";

createService("transcoder", TranscoderModule);
