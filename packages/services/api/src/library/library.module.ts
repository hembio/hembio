import { LibraryEntity, MikroOrmModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { AuthModule } from "~/auth/auth.module";
import { IndexerModule } from "~/indexer/indexer.module";
import { TitleModule } from "~/title/title.module";
import { UserModule } from "~/user/user.module";
import { LibraryResolver } from "./library.resolver";
import { LibraryService } from "./library.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([LibraryEntity]),
    AuthModule,
    UserModule,
    TitleModule,
    IndexerModule,
  ],
  providers: [LibraryResolver, LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
