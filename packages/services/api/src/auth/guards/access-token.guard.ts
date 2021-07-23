import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlContextType } from "@nestjs/graphql";
import { GqlExecutionContext } from "nestjs-mercurius";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    if (context.getType<GqlContextType>() === "graphql") {
      const ctx = GqlExecutionContext.create(context);
      return !!ctx.getContext().user;
    }
    const req = context.switchToHttp().getRequest();
    return !!req.user;
  }
}
