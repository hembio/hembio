import { env } from "process";
import { createLogger } from "@hembio/logger";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { config } from "../../../../../config";
import { capitalize } from "./capitalize";

// eslint-disable-next-line
export async function createService(name: string, module: any): Promise<void> {
  try {
    const logger = createLogger(name);
    // TODO: Remove when the following is fixed https://github.com/nestjs/nest/issues/2343
    const appContext = await NestFactory.createApplicationContext(
      ConfigModule.forRoot({
        load: [config],
      }),
      {
        logger: false,
      },
    );
    const configService = appContext.get(ConfigService);
    // TODO End

    const port = configService.get(`services.${name}.port`);
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      module,
      {
        transport: Transport.TCP,
        options: { port },
      },
    );
    await app.listenAsync();
    // TODO: Remove when the following is fixed https://github.com/nestjs/nest/issues/2343
    // Close the temporary app context since we no longer need it
    appContext.close();
    // TODO End
    logger.info(`${capitalize(name)} is listening on port ${port}`);

    // webpack hmr support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hot = (module as any).hot;
    if (hot) {
      hot.accept();
      hot.dispose(() => app.close());
    }

    process.on("uncaughtException", (e) => {
      logger.error(e, "uncaughtException");
    });

    // process.on("unhandledRejection", () => {
    //   throw new Error("Unhandled rejection");
    // });

    if (env.NODE_ENV !== "production") {
      Error.stackTraceLimit = Infinity;
    }
  } catch (e) {
    console.error("Uncaught exception in service", e);
  }
}
