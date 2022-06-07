import { MikroOrmModule, RefreshTokenEntity, UserEntity } from "@hembio/core";
import { Module } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { FastifyInstance } from "fastify";
import { HEMBIO_JWT_SECRET } from "~/constants";
import { UserModule } from "~/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
    UserModule,
    JwtModule.register({
      secret: HEMBIO_JWT_SECRET,
      signOptions: {
        expiresIn: "1d",
        algorithm: "HS384",
      },
      verifyOptions: {
        algorithms: ["HS384"],
      },
    }),
  ],
  providers: [AuthService, AuthResolver],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
  public constructor(
    private readonly authService: AuthService,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  public onModuleInit(): void {
    // NOTE: Hacky way to create a middleware
    const adapterInstance =
      this.adapterHost.httpAdapter.getInstance<FastifyInstance>();
    adapterInstance.addHook(
      "onRequest",
      // eslint-disable-next-line
      async (req: any, res: any): Promise<void> => {
        req.user = await this.authService.parseAuthHeader(
          req.headers["authorization"],
        );
      },
    );
  }
}
