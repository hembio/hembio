import { EntityManager, SqliteDriver } from "@mikro-orm/sqlite";

export interface TypeGraphQLContext {
  em: EntityManager<SqliteDriver>;
}
