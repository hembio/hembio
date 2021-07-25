import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { CreditsService } from "./credits/credits.service";
import { IndexerService } from "./indexer.service";
import { MetadataService } from "./metadata/metadata.service";
import { ProbeService } from "./probe/probe.service";

@Controller("indexer")
export class IndexerController {
  public constructor(
    private readonly indexerService: IndexerService,
    private readonly creditsService: CreditsService,
    private readonly metadataService: MetadataService,
    private readonly probeService: ProbeService,
  ) {}

  @MessagePattern({ cmd: "version" })
  public version(): { version: string } {
    return { version: this.indexerService.getVersion() };
  }

  @MessagePattern({ cmd: "updateCredits" })
  public updateCredits({ titleId }: { titleId: string }): Promise<boolean> {
    return this.creditsService.queueCreditsUpdate(titleId);
  }

  @MessagePattern({ cmd: "updateMetadata" })
  public updateMetadata({ titleId }: { titleId: string }): Promise<boolean> {
    return this.metadataService.queueMetadataUpdate(titleId);
  }

  @MessagePattern({ cmd: "probeFile" })
  public probeFile({ fileId }: { fileId: string }): Promise<any> {
    console.log(`{ cmd: "probeFile" }`, fileId);
    return this.probeService.probeFile(fileId);
  }
}
