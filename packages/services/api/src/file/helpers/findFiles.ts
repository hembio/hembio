import { FileEntity } from "@hembio/core";
import { FindOptions, Populate } from "@mikro-orm/core";
import { EntityManager, SqliteDriver } from "@mikro-orm/sqlite";

interface Params {
  ids?: string[];
  titleId?: string;
}

export async function findFiles(
  em: EntityManager<SqliteDriver>,
  params: Params,
): Promise<FileEntity[]> {
  const { ids, titleId } = params;

  const filter: Record<string, unknown> = {};
  const options: FindOptions<FileEntity, Populate<FileEntity>> = {};
  const fileRepo = em.getRepository(FileEntity);

  if (ids) {
    filter.id = { $in: ids };
  }

  if (titleId) {
    filter.title = titleId;
  }

  options.cache = true;

  return fileRepo.find(filter, options);
}
