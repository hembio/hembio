/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore-line
import OMDbAPI from "omdbapi";
import { BaseProvider, SearchResult } from "./BaseProvider";

export class OMDbProvider extends BaseProvider {
  public name = "OMDb";
  public description =
    "The OMDb API is a RESTful web service to obtain movie information, all content and images on the site are contributed and maintained by our users. ";

  private api = new OMDbAPI("8d8b53db");

  public async search(query: string, year?: number): Promise<SearchResult[]> {
    query = query.toLowerCase();

    const cacheKey = this.getCacheKey("search", query, year);
    const cachedResults = this.readCache<SearchResult[]>(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }

    try {
      const results = await this.api.search({
        search: query, // required
        type: "movie",
        year,
      });
      if (results) {
        const formattedResults = Object.keys(results).map((key) => {
          const data = results[key];
          return {
            provider: this.name,
            ids: {
              imdb: data.imdbid,
            },
            type: "movie",
            name: data.title,
            year: parseInt(data.year || 0, 10),
          };
        });

        this.storeCache(cacheKey, formattedResults);
        return formattedResults;
      }
    } catch (e) {
      // Ignore
    }
    this.storeCache(cacheKey, [], 1000 * 60 * 30);
    return [];
  }

  public getByImdbId(_imdbId: string): void {
    // TODO: Implement getByImdbId
  }
}
