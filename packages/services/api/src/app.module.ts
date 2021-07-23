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
import { ScheduleModule } from "@nestjs/schedule";
import { CookieModule } from "nest-cookies";
import { MercuriusModule } from "nestjs-mercurius";
import { config } from "../../../../config";
import { createLogger } from "../../../libs/logger/src";
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
import { getServiceProvider } from "./utils/getServiceProvider";

const AppConfigModule = ConfigModule.forRoot({
  load: [config],
  isGlobal: true,
});

@Module({
  imports: [
    AppConfigModule,
    ScheduleModule.forRoot(),
    MikroOrmModule.forRoot(MikroORMConfig),
    MercuriusModule.forRoot({
      graphiql: true,
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
      getServiceProvider,
    ),
  ],
})
export class AppModule implements NestModule {
  private readonly logger = createLogger("api");

  public constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MikroORMMiddleware).forRoutes("graphql");
  }

  public async onApplicationBootstrap(): Promise<void> {
    await this.orm.isConnected();
    try {
      const userCount = await this.em.count(UserEntity);
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
