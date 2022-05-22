import fs from "fs";
import path from "path";
import { MikroORM, Options } from "@mikro-orm/core";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { getCwd } from "~/utils/getCwd";
import { UserEntity } from "./entities";
import mikroORMConfig from "./mikro-orm.config";
import { seedDatabase } from "./seedDatabase";

export async function createORM(
  options?: Options<SqliteDriver>,
): Promise<MikroORM<SqliteDriver>> {
  const dbFile = path.join(getCwd(), ".db", "hembio.sqlite");
  await fs.promises.mkdir(path.dirname(dbFile), { recursive: true });

  const orm = await MikroORM.init({
    debug: false,
    ...mikroORMConfig,
    ...options,
  });

  const generator = orm.getSchemaGenerator();
  try {
    await generator.createSchema();
  } catch {
    // Ignore
  }
  try {
    await generator.updateSchema();
  } catch {
    // Ignore
  }
  let userCount = 0;
  try {
    userCount = await orm.em.count(UserEntity);
  } catch {
    // Ignore
  }

  if (userCount === 0) {
    console.log("First time running. Seeding database...");
    await seedDatabase(orm);
  }
  return orm;
}
