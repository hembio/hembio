import { Module } from "@nestjs/common";
import { TitleController } from "./title.controller";
import { TitleResolver } from "./title.resolver";
import { TitleService } from "./title.service";
import { AuthModule } from "~/auth/auth.module";
import { CreditModule } from "~/credit/credit.module";
import { FileModule } from "~/file/file.module";
import { IndexerModule } from "~/indexer/indexer.module";
import { UserModule } from "~/user/user.module";

@Module({
  imports: [AuthModule, UserModule, FileModule, CreditModule, IndexerModule],
  controllers: [TitleController],
  providers: [TitleService, TitleResolver],
  exports: [TitleService],
})
export class TitleModule {}
