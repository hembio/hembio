import {
  TitleEntity,
  QueryOrderMap,
  FindOptions,
  Populate,
  EntityManager,
  MikroORM,
  TitleGenreSlugs,
  expr,
  TitleGenreLiterals,
} from "@hembio/core";
import { IMDbProvider, SearchResult } from "@hembio/indexer";
import { createLogger } from "@hembio/logger";
import { Injectable } from "@nestjs/common";
import MiniSearch from "minisearch";
import { TitleNotFoundException } from "./exceptions/TitleNotFoundException";

interface Params {
  ids?: string[];
  libraryId?: string;
  orderBy?: QueryOrderMap;
  name?: string | RegExp;
  year?: number | [number, number];
  genre?: Record<TitleGenreLiterals, number>;
  take?: number;
  skip?: number;
}

@Injectable()
export class TitleService {
  private readonly logger = createLogger("api");
  public constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {
    // setTimeout(async () => {
    //   await this.orm.isConnected();
    //   this.setGenreBits();
    // }, 1000);
  }

  public async setGenreBits(): Promise<void> {
    const em = this.em.fork(false);
    const titles = await this.em.find(TitleEntity, { genreBits: null }, [
      "genres",
    ]);

    for (const title of titles) {
      const genres = (await title.genres.init()).getItems();
      let genreBits = 0;
      for (const genre of genres) {
        const genreIndex = TitleGenreSlugs.indexOf(
          genre.slug as TitleGenreLiterals,
        );
        if (genreIndex !== -1) {
          genreBits += Math.pow(2, genreIndex);
        }
      }
      title.genreBits = genreBits;
      await em.persistAndFlush(title);
    }
  }

  public async deleteOneById(id: string): Promise<boolean> {
    const em = this.em.fork(false);
    const title = await em.findOne(TitleEntity, id, [
      "images",
      "credits",
      "files",
    ]);
    if (title) {
      this.logger.debug(`Removing title(${id}): ${title.name} (${title.year})`);

      // Cascading doesn't work for some reason
      // so we need to remove them manually
      await Promise.all([
        title.files.init(),
        title.images.init(),
        title.credits.init(),
      ]);
      for (const entity of [
        ...title.files,
        ...title.images,
        ...title.credits,
      ]) {
        em.remove(entity);
      }

      try {
        await em.removeAndFlush(title);
        return true;
      } catch (e) {
        this.logger.debug(e, "Failed to remove title");
      }
    }
    return false;
  }

  public async findAll(params: Params): Promise<[TitleEntity[], number]> {
    const { ids, libraryId, name, year, genre, take, skip, orderBy } = params;
    const em = this.em.fork(true);

    const $and: Array<string | Record<string, any>> = [];
    if (ids) {
      $and.push({ id: { $in: ids } });
    }

    const options: FindOptions<TitleEntity, Populate<TitleEntity>> = {
      populate: [],
    };

    if (ids) {
      $and.push({ id: { $in: ids } });
    }

    if (libraryId) {
      $and.push({ library: libraryId });
    }

    if (name) {
      $and.push({
        name: typeof name === "string" ? new RegExp(`^${name}.*`, "i") : name,
      });
    }

    if (year) {
      $and.push({
        year: Array.isArray(year) ? { $gte: year[0], $lte: year[1] } : year,
      });
    }

    options.limit = take || 30;
    options.offset = skip || 0;
    options.orderBy = orderBy;
    // options.cache = true;

    if (genre) {
      for (const [slug, val] of Object.entries(genre)) {
        const idx = TitleGenreSlugs.indexOf(slug as TitleGenreLiterals);
        if (idx === -1) {
          continue;
        }
        const mask = Math.pow(2, idx);
        if (val === 1) {
          $and.push({ [expr(`genre_bits & ${mask}`)]: mask });
        } else if (val === -1) {
          $and.push({ [expr(`genre_bits & ${mask}`)]: { $ne: mask } });
        }
      }
    }

    console.dir({ $and }, { depth: null });

    return em.findAndCount(TitleEntity, { $and }, options);
  }

  public async findOneById(id: string): Promise<TitleEntity> {
    const em = this.em.fork(true);
    const title = await em.findOne(TitleEntity, id, ["files", "genres"]);
    if (!title) {
      throw new TitleNotFoundException();
    }
    return title;
  }

  public async findOneBySlug(slug: string): Promise<TitleEntity> {
    const em = this.em.fork(true);
    const title = await em.findOne(TitleEntity, { slug });
    if (!title) {
      throw new TitleNotFoundException();
    }
    return title;
  }

  public async identify(id: string): Promise<SearchResult[]> {
    const title = await this.findOneById(id);
    if (!title) {
      throw new TitleNotFoundException();
    }

    const provider = new IMDbProvider();
    const result = await provider.search(title.name, title.year);
    return result;
  }

  public async search(query: string): Promise<TitleEntity[]> {
    const em = this.em.fork(true);
    const qb = em.createQueryBuilder(TitleEntity);
    const allTitles = await qb.select(["id", "year", "name"]).execute();

    const miniSearch = new MiniSearch({
      fields: ["name", "year"],
      storeFields: ["id"],
      searchOptions: {
        boost: { title: 4 },
        fuzzy: 0.2,
      },
    });
    miniSearch.addAll(allTitles);
    const sortedIds: string[] = miniSearch
      .search(query)
      .slice(0, 8)
      .map((r) => r.id);
    // To preserve the order we will find one at a time
    return Promise.all(
      sortedIds.map(
        (id) => em.findOne(TitleEntity, id, ["genres"]) as Promise<TitleEntity>,
      ),
    );
  }
}
