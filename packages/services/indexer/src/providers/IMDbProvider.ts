import axios from "axios";
import { remove as removeDiacritics } from "diacritics";
import { parse } from "node-html-parser";
import { BaseProvider, SearchResult } from "./BaseProvider";

const client = axios.create({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43",
  },
});

export class IMDbProvider extends BaseProvider {
  public name = "IMDb";
  public description = "";

  public async search(query: string, year?: number): Promise<SearchResult[]> {
    query = year ? `${query} ${year}` : query;
    query = removeDiacritics(
      query
        .toLowerCase()
        .replace(/[ ]/g, "_")
        .replace(/[()[\]#,.:]/g, "")
        .trim(),
    ).trim();

    const useCache = true;
    const cacheKey = this.getCacheKey("search", query, year);
    const cachedResults = this.readCache<SearchResult[]>(cacheKey);
    if (useCache && cachedResults) {
      return cachedResults;
    }

    try {
      const res = await client.get(
        `https://v2.sg.media-imdb.com/suggestion/${query[0]}/${query}.json`,
      );
      if (res.data?.d) {
        const formattedResults = res.data.d
          .map((res: any) => {
            let type = "movie";
            switch (res.q) {
              case "feature":
              case "video":
              case "documentary":
              case "tv_movie":
              case "short":
                type = "movie";
                break;
              case "tv_series":
              case "tv_miniseries":
              case "tv_special":
              case "tv_short":
                type = "tv";
                break;
              default:
                return null;
                break;
            }
            if (res.id.startsWith("nm")) {
              type = "person";
            }
            return {
              provider: this.name,
              ids: {
                imdb: res.id,
              },
              name: res.l,
              year: res.y,
              type,
            };
          })
          .filter((res: any) => !!res);
        this.storeCache(cacheKey, formattedResults);
        this.saveCache();
        return formattedResults;
      }
    } catch (e) {
      console.error(e);
    }
    this.storeCache(cacheKey, [], 1000 * 60 * 30);
    return [];
  }

  public async metadata(id: string): Promise<void> {
    const res = await client.get(`https://www.imdb.com/title/${id}/`);
    if (res.status === 200) {
      const document = parse(res.data);
      const summary = document.querySelector(".summary_text").innerText.trim();
      const subtext = document.querySelector(".subtext");
      console.log(summary);
    }
  }
}
