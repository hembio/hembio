import { EntityManager } from "@hembio/core";
import type { EntityData, AnyEntity } from "@hembio/core";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HEMBIO_API_VERSION } from "./constants";

@Injectable()
export class AppService {
  public constructor(private readonly em: EntityManager) {}

  public getVersion(): string {
    return HEMBIO_API_VERSION;
  }

  public getHello(): string {
    return "Hello from Hembio!";
  }

  // Run every day at 03:00 by default
  @Cron("0 0 3 * * *", {
    name: "vacuum_sqlite",
  })
  public async vacuumSqlite(): Promise<EntityData<AnyEntity<unknown>>> {
    const conn = this.em.getConnection();
    const res = await conn.execute("VACUUM;");
    return res;
  }
}
