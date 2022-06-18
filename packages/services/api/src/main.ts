import { getEnv, getPki, internalIp } from "@hembio/core";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { WsAdapter } from "@nestjs/platform-ws";
import { Logger } from "nestjs-pino";
import { allowedHeaders } from "./allowedHeaders";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const env = getEnv();
  const ip = env.HEMBIO_SERVER_HOST || (await internalIp.v4()) || "127.0.0.1";
  const [key, cert] = await getPki("hembio.local", ip);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      http2: true,
      https: {
        allowHTTP1: true,
        key,
        cert,
      },
    }),
    {
      bufferLogs: true,
    },
  );
  const logger = app.get(Logger);
  app.useLogger(logger);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("services.api.port") as number;

  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // app.register(fastifyCookie as any, {
  //   secret: "my-secret", // for cookies signature
  // });

  try {
    await app.listen(port, ip);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (e) {
    logger.error(e);
  }

  // webpack hmr support
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hot = (module as any).hot;
  if (hot) {
    hot.accept();
    hot.dispose(() => app.close());
  }
}
bootstrap();
