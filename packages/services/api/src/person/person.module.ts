import { MikroOrmModule, PersonEntity } from "@hembio/core";
import { Module } from "@nestjs/common";
import { PersonResolver } from "./person.resolver";
import { PersonService } from "./person.service";
import { AuthModule } from "~/auth/auth.module";
import { TitleModule } from "~/title/title.module";

@Module({
  imports: [MikroOrmModule.forFeature([PersonEntity]), AuthModule, TitleModule],
  providers: [PersonResolver, PersonService],
})
export class PersonModule {}
