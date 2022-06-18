import { env } from "process";
import { INestMicroservice } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { Logger } from "nestjs-pino";
import { config } from "../../../../../config";
import { capitalize } from "./capitalize";

export async function createService(
  name: string,
  // eslint-disable-next-line
  module: any,
): Promise<{ app: INestMicroservice; logger: Logger }> {
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
      bufferLogs: true,
    },
  );

  const logger = app.get(Logger);
  app.useLogger(logger);

  await app.listen();
  // TODO: Remove when the following is fixed https://github.com/nestjs/nest/issues/2343
  // Close the temporary app context since we no longer need it
  appContext.close();
  // TODO End
  logger.log(`${capitalize(name)} is listening on port ${port}`);

  // webpack hmr support
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hot = (module as any).hot;
  if (hot) {
    hot.accept();
    hot.dispose(() => app.close());
  }

  process.on("uncaughtExceptionMonitor", (e: Error, origin: string) => {
    logger.error(e, origin);
  });

  if (env.NODE_ENV !== "production") {
    Error.stackTraceLimit = Infinity;
  }

  return { app, logger };
}
