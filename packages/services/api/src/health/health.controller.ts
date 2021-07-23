import { Controller, Get } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    return this.health.check([
      async () =>
        this.microservice.pingCheck("indexer", {
          transport: Transport.TCP,
          host: "localhost",
          port: 42070,
        }),
      async () =>
        this.microservice.pingCheck("transcoder", {
          transport: Transport.TCP,
          host: "localhost",
          port: 42071,
        }),
      async () =>
        this.microservice.pingCheck("metadata", {
          transport: Transport.TCP,
          host: "localhost",
          port: 42072,
        }),
      async () =>
        this.microservice.pingCheck("images", {
          transport: Transport.TCP,
          host: "localhost",
          port: 42073,
        }),
    ]);
  }
}
