import { LibraryEntity, MikroOrmModule } from "@hembio/core";
import { Module } from "@nestjs/common";
import { LibraryResolver } from "./library.resolver";
import { LibraryService } from "./library.service";
import { AuthModule } from "~/auth/auth.module";
import { TitleModule } from "~/title/title.module";
import { UserModule } from "~/user/user.module";

@Module({
  imports: [
    MikroOrmModule.forFeature([LibraryEntity]),
    AuthModule,
    UserModule,
    TitleModule,
  ],
  providers: [LibraryResolver, LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
