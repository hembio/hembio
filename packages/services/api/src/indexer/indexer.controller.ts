import { Controller, Get, UseGuards } from "@nestjs/common";
import { Observable } from "rxjs";
import { AccessTokenGuard } from "~/auth/guards/access-token.guard";
import { IndexerService } from "./indexer.service";

@Controller("indexer")
@UseGuards(AccessTokenGuard)
export class IndexerController {
  public constructor(private readonly indexerService: IndexerService) {}

  @Get("/")
  public version(): Observable<{ version: string }> {
    return this.indexerService.getVersion();
  }
}
