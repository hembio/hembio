/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import { FileLRU, getCwd } from "@hembio/core";

export interface IBaseProvider {
  name: string;
  description: string;
  search(query: string, year?: number): Promise<any>;
}

export interface SearchResult {
  provider: string;
  ids: { [key: string]: string | number };
  name: string;
  normalizedName?: string;
  year: number;
  type: string;
}

interface CacheEntry<T = any> {
  ttl: number;
  data: T;
}

export interface ImageEntry {
  provider: string;
  id?: string;
  url: string;
  lang?: string;
  score: number;
}

export interface ImagesResult {
  provider: string;
  type: string;
  images: {
    background?: ImageEntry[];
    banner?: ImageEntry[];
    clearart?: ImageEntry[];
    disc?: ImageEntry[];
    logo?: ImageEntry[];
    poster?: ImageEntry[];
    thumb?: ImageEntry[];
  };
}

export abstract class BaseProvider implements IBaseProvider {
  // Store cache for 1 days per default
  protected cacheTtl = 1000 * 60 * 60 * 24;
  public name!: string;
  public description = "Add description";

  protected cache!: FileLRU<CacheEntry>;

  public constructor() {
    this.cache = new FileLRU<CacheEntry>(
      path.join(
        getCwd(),
        ".cache",
        `metadata-${this.constructor.name
          .toLowerCase()
          .replace(/ /g, "")}.json`,
      ),
      1024,
    );
  }

  public async search(_query: string, _year?: number): Promise<SearchResult[]> {
    throw new Error("Method not implemented.");
  }

  protected getCacheKey(fnName: string, ...args: any[]): string {
    return [this.name, fnName, ...args]
      .filter((v) => !!v && v.toString)
      .map((s) => s.toString().replace(/\W/gi, ""))
      .join("-")
      .toLowerCase();
  }

  protected storeCache(id: string, data: any, ttl?: number): void {
    try {
      this.cache.set(id, {
        ttl: Date.now() + (ttl || this.cacheTtl),
        data,
      });
    } catch (e) {
      // Do nothing
    }
  }

  protected saveCache() {
    this.cache.saveSync();
  }

  protected readCache<T>(id: string): T | undefined {
    try {
      const doc = this.cache.get(id);
      if (doc) {
        if (doc.data && Date.now() < doc.ttl) {
          return doc.data;
        } else {
          this.cache.delete(id);
        }
      }
    } catch (e) {
      // Do nothing
    }
    return undefined;
  }
}
