import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ClientProxy,
  ClientProxyFactory,
  Closeable,
  Transport,
} from "@nestjs/microservices";

export function getServiceClientProxy(
  service: string,
): Provider<ClientProxy & Closeable> {
  return {
    provide: `${service.toUpperCase()}_SERVICE`,
    useFactory: (configService: ConfigService) => {
      const options = configService.get<{ port: number; host: string }>(
        `services.${service}`,
      );
      return ClientProxyFactory.create({ transport: Transport.TCP, options });
    },
    inject: [ConfigService],
  };
}
