import { Controller, Get, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Controller("transcoder")
export class TranscoderController {
  public constructor(
    @Inject("TRANSCODER_SERVICE")
    private readonly transcoderClient: ClientProxy,
  ) {}

  @Get()
  public version(): Observable<string> {
    return this.transcoderClient.send<string>({ cmd: "version" }, {});
  }

  @Get("/transcode/:fileId")
  public transcode(): void {
    throw new Error("Not implemented");
  }
}
