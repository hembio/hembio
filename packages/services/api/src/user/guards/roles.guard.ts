import { UserRole } from "@hembio/core";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { UserService } from "../user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }

    if (context.getType<GqlContextType>() === "graphql") {
      const ctx = GqlExecutionContext.create(context);
      const user = ctx.getContext().user;
      if (!user) {
        return false;
      }
      return this.userService.matchRoles(roles, user.roles);
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return this.userService.matchRoles(roles, user.roles);
  }
}
