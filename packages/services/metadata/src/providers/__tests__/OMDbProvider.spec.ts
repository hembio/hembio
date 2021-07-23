import { OMDbProvider } from "../OMDbProvider";

describe("OMDbProvider", () => {
  it("should initialize", () => {
    const provider = new OMDbProvider();
    expect(provider).toBeInstanceOf(OMDbProvider);
  });

  it("should find Interstellar", async () => {
    const provider = new OMDbProvider();
    const result = await provider.search("Interstellar", 2014);
    expect(result[0].name).toBe("Interstellar");
  });
});
