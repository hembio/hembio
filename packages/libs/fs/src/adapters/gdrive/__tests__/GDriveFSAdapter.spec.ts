import { createWriteStream } from "fs";
import { stat, unlink } from "fs/promises";
import "jest";
import path from "path";
import { Readable } from "stream";
import { GDriveFSAdapter } from "../GDriveFSAdapter";

const keyFile = path.join(__dirname, "../../../../credentials.json");
const impersonate = "me@writeless.se";

describe("GDriveFSAdapter", () => {
  it("should create adapter", async () => {
    const fs = await GDriveFSAdapter.create("/", { keyFile, impersonate });
    expect(fs).toBeInstanceOf(GDriveFSAdapter);
  });

  it("should readdir", async () => {
    const fs = await GDriveFSAdapter.create("/", { keyFile, impersonate });
    expect(fs).toBeInstanceOf(GDriveFSAdapter);
    const files = await fs.readdir("/media");
    expect(files.length).toBeGreaterThan(0);
  });

  it("should stat file", async () => {
    const fs = await GDriveFSAdapter.create("/", { keyFile, impersonate });
    expect(fs).toBeInstanceOf(GDriveFSAdapter);
    const stat = await fs.stat(
      "/media/Movies/Spaceballs (1987)/Spaceballs (1987) - 1080p.mkv",
    );
    expect(stat?.size).toBeGreaterThan(0);
    expect(stat?.ctime).toBeInstanceOf(Date);
    expect(stat?.mtime).toBeInstanceOf(Date);
    expect(stat?.isFile()).toBe(true);
  });

  it("should stream file", async () => {
    const fs = await GDriveFSAdapter.create("/", { keyFile, impersonate });
    expect(fs).toBeInstanceOf(GDriveFSAdapter);
    const stream = await fs.createReadStream(
      "/media/Movies/Spaceballs (1987)/Spaceballs (1987) - 1080p.mkv",
      { start: 0, end: 4096000 - 1 },
    );
    stream.pipe(createWriteStream("./test.mp4"));

    expect(stream).toBeInstanceOf(Readable);

    await new Promise<void>((resolve) => {
      stream.on("close", async () => {
        console.log("Stream closed!");
        resolve();
      });
    });
    const stats = await stat("./test.mp4");
    expect(stats.size).toBe(4096000);
    await unlink("./test.mp4");
  }, 100000000);
});
