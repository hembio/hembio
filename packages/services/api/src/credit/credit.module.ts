import { CreditEntity, MikroOrmModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { CreditResolver } from "./credit.resolver";
import { CreditService } from "./credit.service";
import { getServiceClientProxy } from "~/utils/getServiceClientProxy";

const ImageClientProxy = getServiceClientProxy("indexer");

@Module({
  imports: [MikroOrmModule.forFeature([CreditEntity])],
  providers: [ImageClientProxy, CreditService, CreditResolver],
  exports: [CreditService],
})
export class CreditModule {}
