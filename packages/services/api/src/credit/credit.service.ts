import {
  CreditEntity,
  EntityRepository,
  InjectRepository,
  QueryOrder,
} from "@hembio/core";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class CreditService {
  public constructor(
    @InjectRepository(CreditEntity)
    private readonly creditRepo: EntityRepository<CreditEntity>,
    @Inject("INDEXER_SERVICE")
    private readonly indexerClient: ClientProxy,
  ) {}

  public async getTopBilling(titleId: string): Promise<CreditEntity[]> {
    return this.creditRepo.find(
      { title: titleId, order: { $ne: null } },
      ["person"],
      {
        order: QueryOrder.ASC,
      },
      6,
    );
  }

  public async getCast(titleId: string): Promise<CreditEntity[]> {
    return this.creditRepo.find(
      { title: titleId, order: { $ne: null } },
      ["person"],
      {
        order: QueryOrder.ASC,
      },
    );
  }

  public async getCrew(titleId: string): Promise<CreditEntity[]> {
    return this.creditRepo.find({ title: titleId, order: null }, ["person"]);
  }
}
