import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  public constructor(private readonly apiService: AppService) {}

  @Get()
  public version(): { version: string } {
    return { version: this.apiService.getVersion() };
  }

  @Get("/hello")
  public hello(): string {
    return this.apiService.getHello();
  }

  @Get("/vacuum")
  public async vacuum(): Promise<unknown> {
    return this.apiService.vacuumSqlite();
  }
}
