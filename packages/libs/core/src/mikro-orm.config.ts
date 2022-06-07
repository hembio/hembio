import { AsyncLocalStorage } from "async_hooks";
import path from "path";
import { Options, PoolConfig } from "@mikro-orm/core";
import { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { EntityManager, SqliteDriver } from "@mikro-orm/sqlite";
import {
  CreditEntity,
  FileEntity,
  GenreEntity,
  LibraryEntity,
  PersonEntity,
  RefreshTokenEntity,
  TitleEntity,
  UserEntity,
  TaskEntity,
  ImageEntity,
} from "./entities";
import { getCwd } from "./utils/getCwd";

type Config = Options<SqliteDriver> &
  MikroOrmModuleSyncOptions & {
    pool: PoolConfig & {
      createTimeoutMillis?: number;
      destroyTimeoutMillis?: number;
      createRetryIntervalMillis?: number;
      propagateCreateError?: boolean;
    };
  };

const storage = new AsyncLocalStorage<EntityManager>();

const config: Config = {
  // TODO: Remove once we've fixed the underlying issue
  // Reference: https://mikro-orm.io/docs/identity-map#global-identity-map
  allowGlobalContext: true,
  entities: [
    CreditEntity,
    FileEntity,
    GenreEntity,
    LibraryEntity,
    PersonEntity,
    RefreshTokenEntity,
    TitleEntity,
    UserEntity,
    TaskEntity,
    ImageEntity,
  ],
  driver: SqliteDriver,
  pool: {
    min: 0,
    max: 1000,
    // acquireTimeoutMillis: 100000,
    // createTimeoutMillis: 100000,
    // destroyTimeoutMillis: 100000,
    // idleTimeoutMillis: 100000,
    // reapIntervalMillis: 3000,
    // createRetryIntervalMillis: 200,
    // propagateCreateError: false,
  },
  type: "sqlite",
  charset: "utf-8",
  forceUtcTimezone: true,
  cache: {
    enabled: false,
    pretty: true,
    options: { cacheDir: path.join(getCwd(), ".cache", "entities") },
  },
  dbName: path.join(getCwd(), ".db", "hembio.sqlite"),
  baseDir: __dirname,
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    tableName: "mikro_orm_migrations", // name of database table with log of executed transactions
    path: path.resolve(__dirname, "./migrations"), // path to the folder with migrations
    // pattern: /^[\w-]+\d+\.ts$/, // regex pattern for the migration files
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    emit: "ts", // migration generation mode
  },
  registerRequestContext: false, // disable automatic middleware
  context: () => storage.getStore(), // use our AsyncLocalStorage instance
  highlighter: new SqlHighlighter(),
  // debug: true, // ["query"],
};

export default config;
