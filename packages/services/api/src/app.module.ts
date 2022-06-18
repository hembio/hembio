import path from "path";
import {
  EntityManager,
  MikroORM,
  MikroORMConfig,
  MikroOrmModule,
  UserEntity,
  seedDatabase,
} from "@hembio/core";
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { ScheduleModule } from "@nestjs/schedule";
import GraphQLJSON from "graphql-type-json";
import { CookieModule } from "nest-cookies";
import { LoggerModule, PinoLogger } from "nestjs-pino";
import { config } from "../../../../config";
import { AppController as AppController } from "./app.controller";
import { AppService as AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CreditModule } from "./credit/credit.module";
import { EventModule } from "./event/event.module";
import { FileModule } from "./file/file.module";
import { HealthModule } from "./health/health.module";
import { ImageModule } from "./image/image.module";
import { IndexerModule } from "./indexer/indexer.module";
import { LibraryModule } from "./library/library.module";
import { MikroORMMiddleware } from "./mikro-orm.middleware";
import { PersonModule } from "./person/person.module";
import { StatsModule } from "./stats/stats.module";
import { StreamModule } from "./stream/stream.module";
import { TitleModule } from "./title/title.module";
import { TranscoderModule } from "./transcoder/transcoder.module";
import { UserModule } from "./user/user.module";
import { getServiceClientProxy } from "./utils/getServiceClientProxy";

const AppConfigModule = ConfigModule.forRoot({
  load: [config],
  isGlobal: true,
});

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: [
        {
          level: process.env.NODE_ENV !== "production" ? "debug" : "info",
          // install 'pino-pretty' package in order to use the following option
          transport:
            process.env.NODE_ENV !== "production"
              ? { target: "pino-pretty" }
              : undefined,
        },
        process.stdout,
      ],
    }),
    AppConfigModule,
    ScheduleModule.forRoot(),
    MikroOrmModule.forRoot(MikroORMConfig),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: path.resolve(__dirname, "../generated/schema.graphql"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: (req: any) => ({
        user: req.user,
      }),
      subscription: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context: (_conn, req: any) => ({
          user: req.user,
        }),
      },
    }),
    CookieModule,
    AuthModule,
    HealthModule,
    EventModule,
    UserModule,
    LibraryModule,
    TitleModule,
    FileModule,
    ImageModule,
    TranscoderModule,
    IndexerModule,
    StreamModule,
    StatsModule,
    CreditModule,
    PersonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...["indexer", "images", "metadata", "transcoder"].map<Provider>(
      getServiceClientProxy,
    ),
  ],
})
export class AppModule implements NestModule {
  public constructor(
    private readonly logger: PinoLogger,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  public async configure(consumer: MiddlewareConsumer): Promise<void> {
    await this.orm.isConnected();
    try {
      const userCount = await this.em.count(UserEntity);
      if (userCount === 0) {
        this.logger.info("First time running. Seeding database...");
        await seedDatabase(this.orm);
      }
    } catch (e) {
      try {
        this.logger.info("First time running. Seeding database...");
        await seedDatabase(this.orm);
      } catch (e) {
        this.logger.error(e, "Failed to seed database!");
      }
      // Ignore
    }
    consumer.apply(MikroORMMiddleware).forRoutes("graphql");
  }

  public async onApplicationBootstrap(): Promise<void> {
    await this.orm.isConnected();
    try {
      const userCount = await this.em.count(UserEntity);
      console.log("userCount", userCount);
      if (userCount === 0) {
        this.logger.info("First time running. Seeding database...");
        await seedDatabase(this.orm);
      }
    } catch (e) {
      this.logger.error(e, "Failed to seed database!");
      // Ignore
    }
  }
}
