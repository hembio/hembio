import "jest";
import { findFiles } from "../findFiles";

describe("findFiles", () => {
  it("should find files really fast", async () => {
    const res = await findFiles("../../");
    expect(res.files.length).toBeGreaterThan(1000);
  });
});
