import * as path from "path";
import { TitleType } from "@hembio/core";
import Trakt from "trakt.tv";
import * as matcher from "trakt.tv-matcher";
import { TRAKT_ID, TRAKT_SECRET } from "../secrets";
import { BaseProvider, SearchResult } from "./BaseProvider";

export class TraktProvider extends BaseProvider {
  public name = "Trakt";
  public description = "";

  private api = new Trakt({
    client_id: TRAKT_ID,
    client_secret: TRAKT_SECRET,
    plugins: {
      matcher,
    },
  });

  public async search(query: string, year?: number): Promise<SearchResult[]> {
    query = query.toLocaleLowerCase();
    const cacheKey = this.getCacheKey("search", query, year);
    const cachedResults = this.readCache<SearchResult[]>(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }
    const res = await this.api.search.text({
      query,
      year,
      type: "movie",
    });

    if (res && res.length > 0) {
      const formattedResults = res.map((res: any) => {
        const type = res.type;
        const data = res[type];
        return {
          provider: this.name,
          ids: data.ids,
          type,
          name: data.title,
          year: data.year,
          score: res.score,
        };
      });
      this.storeCache(cacheKey, formattedResults);
      this.saveCache();
      return formattedResults;
    }
    this.storeCache(cacheKey, [], 1000 * 60 * 30);
    return [];
  }

  public async fileMatcher(fullPath: string): Promise<any> {
    const filename = path.basename(fullPath);
    const rootPath = path.dirname(fullPath);
    const res = await this.api.matcher.match({
      filename,
      path: rootPath,
    });
    console.error(res);
    return res;
  }

  public async metadata(type: TitleType, id: number): Promise<any> {
    try {
      switch (type) {
        case TitleType.MOVIE: {
          try {
            return this.api.movies.summary({ id, extended: "full" });
          } catch {
            return undefined;
          }
        }
        case TitleType.TVSHOW: {
          try {
            return this.api.shows.summary({ id, extended: "full" });
          } catch {
            return undefined;
          }
        }
        default:
          throw Error("Unknown type");
      }
    } catch {
      return undefined;
    }
  }
}
