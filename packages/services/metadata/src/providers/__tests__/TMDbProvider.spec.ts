import { TitleType } from "../../../../../libs/core/src";
import { TMDbProvider } from "../TMDbProvider";

describe("TMDbProvider", () => {
  it("should initialize", () => {
    const tmdb = new TMDbProvider();
    expect(tmdb).toBeInstanceOf(TMDbProvider);
  });

  it("should find Interstellar (2014)", async () => {
    const tmdb = new TMDbProvider();
    const result = await tmdb.search("Interstellar", 2014);
    expect(result[0].name).toBe("Interstellar");
    expect(result[0].year).toBe(2014);
    expect(result[0].ids.tmdb).toBe(157336);
  });

  it("should return images for Interstellar (2014)", async () => {
    const tmdb = new TMDbProvider();
    const result = await tmdb.images(TitleType.MOVIE, "tt6882604");
    expect(result?.images.background?.length).toBeGreaterThan(0);
    expect(result?.images.poster?.length).toBeGreaterThan(0);
  });

  it("should return credits for Interstellar (2014)", async () => {
    const tmdb = new TMDbProvider();
    const result = await tmdb.credits(TitleType.MOVIE, "tt6882604");
    expect(result?.cast?.length).toBeGreaterThan(0);
    expect(result?.cast?.[0].name).toBe("Theo James");
  });
});
