import { FanartProvider } from "../FanartProvider";

describe("FanartProvider", () => {
  it("should initialize", () => {
    expect.assertions(1);
    const provider = new FanartProvider();
    expect(provider).toBeInstanceOf(FanartProvider);
  });

  it("should fetch images for Interstellar", async () => {
    expect.assertions(9);
    const provider = new FanartProvider();
    const data = await provider.images("tt0816692");
    expect(data?.type).toBe("movie");
    expect(data?.images.clearart).toBeDefined();
    expect(data?.images.logo).toBeDefined();
    expect(data?.images.banner).toBeDefined();
    expect(data?.images.disc).toBeDefined();
    expect(data?.images.poster).toBeDefined();
    expect(data?.images.background).toBeDefined();
    expect(data?.images.thumb).toBeDefined();
  });
});
