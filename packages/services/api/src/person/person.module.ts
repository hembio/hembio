import { MikroOrmModule, PersonEntity } from "@hembio/core";
import { Module } from "@nestjs/common";
import { PersonResolver } from "./person.resolver";
import { PersonService } from "./person.service";
import { AuthModule } from "~/auth/auth.module";
import { ImageService } from "~/image/image.service";
import { TitleModule } from "~/title/title.module";

@Module({
  imports: [
    MikroOrmModule.forFeature([PersonEntity]),
    AuthModule,
    TitleModule,
    ImageService,
  ],
  providers: [PersonResolver, PersonService],
})
export class PersonModule {}
