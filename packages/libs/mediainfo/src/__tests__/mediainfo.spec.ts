import path from "path";
import { mediainfo } from "../index";

const testFile = path.join(__dirname, "test1.mkv");

describe.skip("mediainfo", () => {
  it("should get media info", async () => {
    expect.assertions(4);
    const mi = await mediainfo(testFile);
    expect(mi.general.format).toBe("Matroska");
    expect(mi.video?.length).toBe(1);
    expect(mi.audio?.length).toBe(2);
    expect(mi.subs?.length).toBe(2);
  }, 100000);
});
