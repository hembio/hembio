import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export function getServiceProvider(service: string): Provider {
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
