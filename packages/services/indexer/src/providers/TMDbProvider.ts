import { TitleType } from "@hembio/core";
import { MovieDb } from "moviedb-promise";
import {
  CreditsResponse,
  MovieResponse,
  Person,
  ShowResponse,
} from "moviedb-promise/dist/request-types";
import { TMDB_API_KEY } from "../secrets";
import { BaseProvider, ImagesResult, SearchResult } from "./BaseProvider";

export class TMDbProvider extends BaseProvider {
  public name = "TMDb";
  public description =
    "The Movie Database (TMDb) is a community built movie and TV database.";

  private apiKey = TMDB_API_KEY || "";
  private api = new MovieDb(this.apiKey);

  public async search(query: string, year?: number): Promise<SearchResult[]> {
    const cacheKey = this.getCacheKey("search", query, year);
    const cachedResults = this.readCache<SearchResult[]>(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }

    const results = await this.api.searchMovie({ query, year });
    if (results && results.results) {
      const formattedResults = results.results.map((res) => {
        const date = res.release_date ? new Date(res.release_date) : undefined;
        const type = "movie";
        return {
          provider: this.name,
          ids: {
            tmdb: res.id || -1,
          },
          name: res.title || "",
          type,
          year: date ? date.getUTCFullYear() : -1,
        };
      });
      this.storeCache(cacheKey, formattedResults);
      this.saveCache();
      return formattedResults;
    }
    this.storeCache(cacheKey, [], 1000 * 60 * 30);
    this.saveCache();
    return [];
  }

  public async images(
    type: TitleType,
    id: string | number,
  ): Promise<ImagesResult | undefined> {
    if (type === TitleType.MOVIE) {
      try {
        const results = await this.api.movieImages({
          id: id,
          language: "en-US",
          include_image_language: "en,null",
        });
        const { backdrops = [], posters = [] } = results;

        const background = backdrops.map((bp) => {
          return {
            provider: this.name,
            url: `https://image.tmdb.org/t/p/original/` + bp.file_path || "",
            score: bp.vote_count || 0,
          };
        });
        const poster = posters.map((bp) => {
          return {
            provider: this.name,
            url: `https://image.tmdb.org/t/p/original/` + bp.file_path || "",
            score: bp.vote_count || 0,
          };
        });
        return {
          provider: this.name,
          type,
          images: {
            background,
            poster,
          },
        };
      } catch {
        // Ignore
      }
    }
    return undefined;
  }

  public async credits(
    type: TitleType,
    id: number | string,
  ): Promise<CreditsResponse | undefined> {
    switch (type) {
      case TitleType.MOVIE:
        try {
          return await this.api.movieCredits(id);
        } catch {
          return undefined;
        }
      case TitleType.TVSHOW:
        try {
          return await this.api.tvCredits(id);
        } catch {
          return undefined;
        }
      default:
        throw Error("Unknown type");
    }
  }

  public async person(id: number | string): Promise<Person | undefined> {
    try {
      return await this.api.personInfo(id);
    } catch {
      return undefined;
    }
  }

  public async metadata(
    type: TitleType.TVSHOW,
    id: number | string,
  ): Promise<ShowResponse | undefined>;
  public async metadata(
    type: TitleType.MOVIE,
    id: number | string,
  ): Promise<MovieResponse | undefined>;
  public async metadata(
    type: TitleType,
    id: number | string,
  ): Promise<MovieResponse | ShowResponse | undefined> {
    switch (type) {
      case TitleType.MOVIE:
        try {
          return await this.api.movieInfo(id);
        } catch {
          return undefined;
        }
      case TitleType.TVSHOW:
        try {
          return await this.api.tvInfo(id);
        } catch {
          return undefined;
        }
      default:
        throw Error("Unknown type");
    }
  }
}
