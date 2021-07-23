import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext, GqlContextType } from "@nestjs/graphql";
import { AuthService } from "../auth.service";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  public constructor(private readonly authService: AuthService) {}
  public canActivate(context: ExecutionContext): boolean {
    let ctx = context;
    if (context.getType<GqlContextType>() === "graphql") {
      ctx = GqlExecutionContext.create(context);
    }
    const req = ctx.switchToHttp().getRequest();
    // Check for existing refresh
    const refreshTokenPayload = req.cookies["hembio-refresh-token"]
      ? this.authService.decodeToken(req.cookies["hembio-refresh-token"])
      : undefined;

    if (!refreshTokenPayload) {
      throw new UnauthorizedException("Missing refresh token");
    }

    if (Date.now() >= refreshTokenPayload.expires) {
      throw new UnauthorizedException("Refresh token");
    }

    return !!refreshTokenPayload;
  }
}
