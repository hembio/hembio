import { TitleType } from "../../../../../libs/core/src";
import { TraktProvider } from "../TraktProvider";

describe("TraktProvider", () => {
  it("should initialize", () => {
    const provider = new TraktProvider();
    expect(provider).toBeInstanceOf(TraktProvider);
  });

  it("should find Interstellar (2014)", async () => {
    const provider = new TraktProvider();
    const result = await provider.search("Interstellar", 2014);
    expect(result[0].name).toBe("Interstellar");
    expect(result[0].year).toBe(2014);
  });

  it.skip("should fetch metadata for Greyhound (2020)", async () => {
    const provider = new TraktProvider();
    const result = await provider.metadata(TitleType.MOVIE, 364601);
    console.log(result);
  });
});
