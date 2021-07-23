import { UserEntity } from "@hembio/core";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: keyof UserEntity, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user as UserEntity;
    return data ? user && user[data] : user;
  },
);
