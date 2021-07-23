import { CreditEntity, MikroOrmModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { CreditService } from "./credit.service";
import { getServiceProvider } from "~/utils/getServiceProvider";
import { CreditResolver } from './credit.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([CreditEntity])],
  providers: [CreditService, getServiceProvider("indexer"), CreditResolver],
  exports: [CreditService],
})
export class CreditModule {}
