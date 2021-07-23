import { UserRole } from "@hembio/core";
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "./guards/access-token.guard";
import { RolesGuard } from "~/user/guards/roles.guard";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AccessTokenGuard, RolesGuard),
  );
}
