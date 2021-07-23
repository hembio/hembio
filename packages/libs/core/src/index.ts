import {
  MikroORM,
  Repository,
  QueryOrder,
  EntityData,
  AnyEntity,
  QueryOrderMap,
  FindOptions,
  Populate,
  FilterQuery,
  RequestContext,
} from "@mikro-orm/core";
import { MikroOrmModule, InjectRepository } from "@mikro-orm/nestjs";
import {
  EntityRepository,
  SqliteDriver,
  EntityManager,
} from "@mikro-orm/sqlite";
import getPort from "get-port";
import internalIp from "internal-ip";
import MikroORMConfig from "./mikro-orm.config";

export * from "./createORM";
export * from "~/entities";
export * from "./seedDatabase";
export {
  MikroORMConfig,
  MikroORM,
  MikroOrmModule,
  Repository,
  EntityManager,
  EntityRepository,
  SqliteDriver,
  QueryOrder,
  InjectRepository,
  RequestContext,
};

export type {
  EntityData,
  AnyEntity,
  QueryOrderMap,
  FindOptions,
  Populate,
  FilterQuery,
};

export * from "~/modules/task";

// NOTE: utils need to be exported separately to avoid cyclic dependencies
export * from "~/utils/beforeExit";
export * from "~/utils/generateUuid";
export * from "~/utils/getCwd";
export * from "~/utils/getEnv";
export * from "~/utils/getPki";
export * from "~/utils/materialColorHash";
export * from "~/utils/prettyDuration";
export * from "~/utils/prettyTime";
export * from "~/utils/createService";
export * from "~/utils/capitalize";
export * from "~/lib";
export * from "~/enums/Times";

export { getPort, internalIp };
