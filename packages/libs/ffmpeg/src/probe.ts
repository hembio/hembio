import path from "path";
import execa from "execa";
import { FFprobeResult } from "./types/probeTypes";

const FFPROBE_BIN = path.resolve(
  __dirname,
  "../../../../bin/win64/ffmpeg/ffprobe.exe",
);

export async function probe(filePath: string): Promise<FFprobeResult> {
  const args = [
    "-hide_banner",
    "-show_format",
    "-show_streams",
    "-print_format",
    "json",
    "-loglevel",
    "quiet",
    filePath,
  ];

  const { stdout } = await execa(FFPROBE_BIN, args);
  const result: FFprobeResult = JSON.parse(stdout);
  if (!result.format) {
    throw Error("Failed to probe");
  }
  return result;
}
