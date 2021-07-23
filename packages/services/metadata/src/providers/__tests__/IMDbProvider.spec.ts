import { IMDbProvider } from "../IMDbProvider";

describe("IMDbProvider", () => {
  it("should initialize", () => {
    const provider = new IMDbProvider();
    expect(provider).toBeInstanceOf(IMDbProvider);
  });

  it("should find Interstellar (2014)", async () => {
    expect.assertions(3);
    const provider = new IMDbProvider();
    const result = await provider.search("Interstellar", 2014);
    expect(result[0].name).toBe("Interstellar");
    expect(result[0].year).toBe(2014);
    expect(result[0].ids.imdb).toBe("tt0816692");
  });

  it("should find Captain Marvel (2019)", async () => {
    expect.assertions(3);
    const provider = new IMDbProvider();
    const result = await provider.search("Captain Marvel", 2019);
    expect(result[0].name).toBe("Captain Marvel");
    expect(result[0].year).toBe(2019);
    expect(result[0].ids.imdb).toBe("tt4154664");
  });

  it("should find Archive (2020)", async () => {
    expect.assertions(3);
    const provider = new IMDbProvider();
    const result = await provider.search("Archive", 2020);
    expect(result[0].name).toBe("Archive");
    expect(result[0].year).toBe(2020);
    expect(result[0].ids.imdb).toBe("tt6882604");
  });

  it.skip("should fetch metadata for Greyhound (2020)", async () => {
    const provider = new IMDbProvider();
    const result = await provider.metadata("tt6048922");
  });
});
