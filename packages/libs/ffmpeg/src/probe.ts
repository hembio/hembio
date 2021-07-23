import path from "path";
import execa from "execa";

const FFPROBE_BIN = path.resolve(__dirname, "../../bin/win64/ffprobe.exe");

export interface ProbeResult {
  streams: Record<string, any>[];
  format: Record<string, any>;
}

export async function probe(filePath: string): Promise<ProbeResult> {
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
  const result: ProbeResult = JSON.parse(stdout);
  if (!result.format) {
    throw Error("Failed to probe");
  }
  return result;
}
