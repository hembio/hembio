import axios from "axios";
import { FANART_API_KEY } from "../secrets";
import { BaseProvider, ImagesResult } from "./BaseProvider";

export class FanartProvider extends BaseProvider {
  public name = "Fanart";
  protected baseUrl = "http://webservice.fanart.tv/v3";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private normalizeImage = (image: any) => {
    return {
      provider: this.name,
      url: image.url,
      score: Number(image.likes),
      lang: image.lang,
    };
  };

  public async images(imdbId: string): Promise<ImagesResult | undefined> {
    const cacheKey = this.getCacheKey("fanart", imdbId);
    const cachedResults = this.readCache<ImagesResult>(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }
    try {
      const res = await axios.get(`${this.baseUrl}/movies/${imdbId}`, {
        params: {
          api_key: FANART_API_KEY,
        },
      });
      const {
        hdmovieclearart: clearart = [],
        hdmovielogo: logo = [],
        movieposter: poster = [],
        moviedisc: disc = [],
        moviebackground: background = [],
        moviebanner: banner = [],
        moviethumb: thumb = [],
      } = res.data;
      const result = {
        provider: this.name,
        type: "movie",
        images: {
          background: background.map(this.normalizeImage),
          banner: banner.map(this.normalizeImage),
          clearart: clearart.map(this.normalizeImage),
          disc: disc.map(this.normalizeImage),
          logo: logo.map(this.normalizeImage),
          poster: poster.map(this.normalizeImage),
          thumb: thumb.map(this.normalizeImage),
        },
      };
      this.storeCache(cacheKey, result);
      return result;
    } catch (e) {
      this.storeCache(cacheKey, undefined, 1000 * 60 * 30);
      return undefined;
    }
  }
}
