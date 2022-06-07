import { UserEntity } from "@hembio/core";
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { CookiesInterceptor, NestCookieRequest } from "nest-cookies";
import { User } from "~/user/decorators/user.decorator";
import { AuthService } from "./auth.service";
import { CredentialsDto } from "./dto/credentials.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { TwoFactorDto } from "./dto/twofactor.dto";
import { InvalidUsernameOrPassword } from "./exceptions/invalid-username-or-password.exception";
import { AccessTokenGuard } from "./guards/access-token.guard";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { AccessTokenResult } from "./interfaces/access-token-result.interface";
import { TfaNeededResult } from "./interfaces/tfa-needed-result.interface";

@UseInterceptors(CookiesInterceptor)
@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Get("/whoami")
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  public whoami(@User() user: UserEntity): UserEntity {
    return user;
  }

  @Post("/sign-up")
  @HttpCode(HttpStatus.CREATED)
  public async signUp(@Body() _signUp: SignUpDto): Promise<void> {
    throw Error("Not implemented");
  }

  @Post("/sign-in")
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Req() req: NestCookieRequest<FastifyRequest>,
    @Body() credentials: CredentialsDto,
  ): Promise<AccessTokenResult | TfaNeededResult> {
    try {
      const authResults = await this.authService.signIn({
        ...credentials,
        device: req.headers["user-agent"] || "unknown",
        ip: req.ip,
      });

      const isTfaNeeded = true;
      if (isTfaNeeded) {
        this.authService.addPendingTfaAuth(authResults);
        return {
          userId: authResults.user.id,
          tfa: true,
        };
      }

      const { accessToken, refreshToken, user, expiryDate, maxAge } =
        authResults;

      req._cookies = [
        {
          name: "hembio-refresh-token",
          value: refreshToken,
          options: {
            maxAge,
            httpOnly: true,
            expires: expiryDate,
            // sameSite: "strict"
            secure: process.env.NODE_ENV === "production",
          },
        },
      ];

      return {
        accessToken: accessToken,
        userId: user.id,
        username: user.username,
      };
    } catch (err) {
      const e = err as Error;
      switch (e.constructor) {
        case InvalidUsernameOrPassword:
          throw new ForbiddenException();
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  @Get("/sign-out")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  public signOut(@Req() req: NestCookieRequest<FastifyRequest>): void {
    req._cookies = [
      {
        name: "hembio-refresh-token",
        value: "",
        options: {
          maxAge: 0,
          httpOnly: true,
          expires: new Date(1970),
          // sameSite: "strict"
          secure: process.env.NODE_ENV === "production",
        },
      },
    ];
  }

  @Get("/access-token")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  public async accessToken(
    @Req() req: NestCookieRequest<FastifyRequest>,
  ): Promise<AccessTokenResult> {
    const refreshTokenPayload = this.authService.decodeToken(
      req.cookies["hembio-refresh-token"],
    );
    try {
      // Everything is fine, sign a new access token
      const { userId, username } = refreshTokenPayload;
      const [accessToken] = await this.authService.signAccessToken(
        userId,
        username,
      );
      return { accessToken, userId, username };
    } catch {
      // Ignore
    }

    throw new InternalServerErrorException("Unknown error");
  }

  @Post("/tfa")
  @HttpCode(HttpStatus.OK)
  public async tfaAuth(
    @Req() req: NestCookieRequest<FastifyRequest>,
    @Body() payload: TwoFactorDto,
  ): Promise<AccessTokenResult> {
    const authResults = this.authService.getPendingTfaAuth(
      payload.userId,
      payload.tfaCode,
    );
    if (!authResults) {
      throw new ForbiddenException();
    }

    const { accessToken, refreshToken, user, expiryDate, maxAge } = authResults;

    req._cookies = [
      {
        name: "hembio-refresh-token",
        value: refreshToken,
        options: {
          maxAge,
          httpOnly: true,
          expires: expiryDate,
          // sameSite: "strict"
          secure: process.env.NODE_ENV === "production",
        },
      },
    ];

    return {
      accessToken: accessToken,
      userId: user.id,
      username: user.username,
    };
  }

  @Get("/tfa/qr")
  @UseGuards(AccessTokenGuard, RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  public async generateTfaQRCode(
    @User() user: UserEntity,
  ): Promise<{ qrCode: string }> {
    const qrCode = await this.authService.generateTfaQrCode(user.id);
    return { qrCode };
  }
}
