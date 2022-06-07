import { UserRole } from "@hembio/core";
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { RolesGuard } from "~/user/guards/roles.guard";
import { AccessTokenGuard } from "./guards/access-token.guard";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AccessTokenGuard, RolesGuard),
  );
}
