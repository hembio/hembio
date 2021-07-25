import "jest";
import { aggregatedSearch } from "../aggregatedSearch";

describe("fetch", () => {
  it("should find #realityhigh (2017)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("#RealityHigh", 2017);
    expect(result).toBeDefined();
    expect(result?.name).toBe("#realityhigh");
    expect(result?.year).toBe(2017);
    expect(result?.ids.imdb).toBe("tt6119504");
    expect(result?.ids.trakt).toBe(301968);
    expect(result?.ids.tmdb).toBe(455656);
  });

  it("should find (500) Days of Summer (2009)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("(500) Days of Summer", 2009);
    expect(result).toBeDefined();
    expect(result?.name).toBe("(500) Days of Summer");
    expect(result?.year).toBe(2009);
    expect(result?.ids.imdb).toBe("tt1022603");
    expect(result?.ids.trakt).toBe(12224);
    expect(result?.ids.tmdb).toBe(19913);
  });

  it("should find Alien (1979)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Alien", 1979);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Alien");
    expect(result?.year).toBe(1979);
    expect(result?.ids.imdb).toBe("tt0078748");
    expect(result?.ids.trakt).toBe(295);
    expect(result?.ids.tmdb).toBe(348);
  });

  it("should find Alien³ (1992)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Alien³", 1992);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Alien³");
    expect(result?.year).toBe(1992);
    expect(result?.ids.imdb).toBe("tt0103644");
    expect(result?.ids.trakt).toBe(4044);
    expect(result?.ids.tmdb).toBe(8077);
  });

  it("should find Star Wars: The Rise of Skywalker", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch(
      "Star Wars The Rise of Skywalker",
      2019,
    );
    expect(result).toBeDefined();
    expect(result?.name).toBe("Star Wars: The Rise of Skywalker");
    expect(result?.year).toBe(2019);
    expect(result?.ids.imdb).toBe("tt2527338");
    expect(result?.ids.trakt).toBe(114335);
    expect(result?.ids.tmdb).toBe(181812);
  });

  it("should find Captain Marvel (2019)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Captain Marvel", 2019);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Captain Marvel");
    expect(result?.year).toBe(2019);
    expect(result?.ids.imdb).toBe("tt4154664");
    expect(result?.ids.trakt).toBe(193963);
    expect(result?.ids.tmdb).toBe(299537);
  });

  it("should find Archive (2020)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Archive", 2020);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Archive");
    expect(result?.year).toBe(2020);
    expect(result?.ids.imdb).toBe("tt6882604");
    expect(result?.ids.trakt).toBe(450934);
    expect(result?.ids.tmdb).toBe(606234);
  });

  it("should find Brimstone (2016)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Brimstone", 2016);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Brimstone");
    expect(result?.year).toBe(2016);
    expect(result?.ids.imdb).toBe("tt1895315");
    expect(result?.ids.trakt).toBe(205135);
    expect(result?.ids.tmdb).toBe(324560);
  });

  it("should find Léon The Professional (1994) #1", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Léon The Professional", 1994);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Léon: The Professional");
    expect(result?.year).toBe(1994);
    expect(result?.ids.imdb).toBe("tt0110413");
    expect(result?.ids.tmdb).toBe(101);
    expect(result?.ids.trakt).toBe(70);
  });

  it("should find Léon The Professional (1994) #2", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Léon", 1994);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Léon: The Professional");
    expect(result?.year).toBe(1994);
    expect(result?.ids.imdb).toBe("tt0110413");
    expect(result?.ids.tmdb).toBe(101);
    expect(result?.ids.trakt).toBe(70);
  });

  it("should find Jurassic Park (1993)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Jurassic Park", 1993);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Jurassic Park");
    expect(result?.year).toBe(1993);
    expect(result?.ids.imdb).toBe("tt0107290");
    expect(result?.ids.trakt).toBe(276);
    expect(result?.ids.tmdb).toBe(329);
  });

  it("should find Æon Flux (2005)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Æon Flux", 2005);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Æon Flux");
    expect(result?.year).toBe(2005);
    expect(result?.ids.imdb).toBe("tt0402022");
    expect(result?.ids.trakt).toBe(4071);
    expect(result?.ids.tmdb).toBe(8202);
  });

  it("should find A Star is Born (2018)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("A Star is Born", 2018);
    expect(result).toBeDefined();
    expect(result?.name).toBe("A Star Is Born");
    expect(result?.year).toBe(2018);
    expect(result?.ids.imdb).toBe("tt1517451");
    expect(result?.ids.trakt).toBe(213443);
    expect(result?.ids.tmdb).toBe(332562);
  });

  it("should find A Star is Born (2010)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("A Star is Born", 2010);
    expect(result).toBeDefined();
    expect(result?.name).toBe("A Star is Born");
    expect(result?.year).toBe(2010);
    expect(result?.ids.imdb).toBe("tt1776364");
    expect(result?.ids.trakt).toBe(405759);
    expect(result?.ids.tmdb).toBe(554861);
  });

  it("should find A Star is Born (1976)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("A Star is Born", 1976);
    expect(result).toBeDefined();
    expect(result?.name).toBe("A Star Is Born");
    expect(result?.year).toBe(1976);
    expect(result?.ids.imdb).toBe("tt0075265");
    expect(result?.ids.trakt).toBe(12071);
    expect(result?.ids.tmdb).toBe(19610);
  });

  it("should find A Star is Born (1954)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("A Star is Born", 1954);
    expect(result).toBeDefined();
    expect(result?.name).toBe("A Star Is Born");
    expect(result?.year).toBe(1954);
    expect(result?.ids.imdb).toBe("tt0047522");
    expect(result?.ids.trakt).toBe(2085);
    expect(result?.ids.tmdb).toBe(3111);
  });

  it("should find I Spit on Your Grave (2010)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("I Spit on Your Grave", 2010);
    expect(result).toBeDefined();
    expect(result?.name).toBe("I Spit on Your Grave");
    expect(result?.year).toBe(2010);
    expect(result?.ids.imdb).toBe("tt1242432");
    expect(result?.ids.trakt).toBe(29693);
    expect(result?.ids.tmdb).toBe(43947);
  });

  it("should find I Spit on Your Grave 2 (2013)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("I Spit on Your Grave 2", 2013);
    expect(result).toBeDefined();
    expect(result?.name).toBe("I Spit on Your Grave 2");
    expect(result?.year).toBe(2013);
    expect(result?.ids.imdb).toBe("tt2537176");
    expect(result?.ids.trakt).toBe(128926);
    expect(result?.ids.tmdb).toBe(207768);
  });

  it("should find I Spit on Your Grave 3 (2015)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("I Spit on Your Grave 3", 2015);
    expect(result).toBeDefined();
    expect(result?.name).toBe("I Spit on Your Grave III: Vengeance is Mine");
    expect(result?.year).toBe(2015);
    expect(result?.ids.imdb).toBe("tt4530884");
    expect(result?.ids.trakt).toBe(222530);
    expect(result?.ids.tmdb).toBe(357096);
  });

  it("should find Kingsman: The Secret Service (2014)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("Kingsman The Secret Service", 2014);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Kingsman: The Secret Service");
    expect(result?.year).toBe(2014);
    expect(result?.ids.imdb).toBe("tt2802144");
    expect(result?.ids.trakt).toBe(128888);
    expect(result?.ids.tmdb).toBe(207703);
  });

  it("should find The Hunchback of Notre Dame (1996)", async () => {
    expect.assertions(6);
    const result = await aggregatedSearch("The Hunchback of Notre Dame", 1996);
    expect(result).toBeDefined();
    expect(result?.name).toBe("The Hunchback of Notre Dame");
    expect(result?.year).toBe(1996);
    expect(result?.ids.imdb).toBe("tt0116583");
    expect(result?.ids.trakt).toBe(5723);
    expect(result?.ids.tmdb).toBe(10545);
  });
});
