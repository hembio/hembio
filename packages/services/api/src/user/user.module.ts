import { MikroOrmModule, UserEntity } from "@hembio/core";
import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { UserExistsValidator } from "./validators/user-exists.validator";

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  providers: [UserResolver, UserService, UserExistsValidator],
  exports: [UserService, UserExistsValidator],
})
export class UserModule {}
