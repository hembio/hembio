import { EntityManager } from "@hembio/core";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { SchedulerRegistry } from "@nestjs/schedule";
import { firstValueFrom, Observable } from "rxjs";
import { EventService } from "~/event/event.service";

@Injectable()
export class IndexerService {
  public constructor(
    @Inject("INDEXER_SERVICE")
    private readonly indexerClient: ClientProxy,
    private readonly em: EntityManager,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventService: EventService,
  ) {}

  private indexers = new Map<string, Observable<unknown>>();

  public getVersion(): Observable<{ version: string }> {
    return this.indexerClient.send({ cmd: "version" }, {});
  }

  public async checkLibrary(libraryId: string): Promise<boolean> {
    return firstValueFrom(
      this.indexerClient.send({ cmd: "checkLibrary" }, { libraryId }),
    );
  }

  public async updateCredits(titleId: string): Promise<boolean> {
    return firstValueFrom(
      this.indexerClient.send({ cmd: "updateCredits" }, { titleId }),
    );
  }

  public async updateMetadata(titleId: string): Promise<boolean> {
    return firstValueFrom(
      this.indexerClient.send({ cmd: "updateMetadata" }, { titleId }),
    );
  }
}
