import { MikroOrmModule, PersonEntity } from "@hembio/core";
import { Module } from "@nestjs/common";
import { AuthModule } from "~/auth/auth.module";
import { ImageModule } from "~/image/image.module";
import { TitleModule } from "~/title/title.module";
import { PersonResolver } from "./person.resolver";
import { PersonService } from "./person.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([PersonEntity]),
    AuthModule,
    TitleModule,
    ImageModule,
  ],
  providers: [PersonResolver, PersonService],
})
export class PersonModule {}
