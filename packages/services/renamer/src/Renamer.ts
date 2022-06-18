import path from "path";
import { pathWalker } from "@hembio/fs";
import { Matcher } from "@hembio/matcher";

export const logger = console;

export class Renamer {
  public constructor(private basePath: string) {
    // Nothing
  }

  public async start(): Promise<void> {
    const renames: Record<string, string> = {};
    for await (const fp of pathWalker(this.basePath)) {
      if (/\.(mkv|mp4|wmv|avi)$/.test(fp)) {
        const relPath = path.relative(this.basePath, fp);
        const match = new Matcher(relPath);
        const from = relPath;
        let to: string;
        if (match.category === "show") {
          to = `${match.show}/Season ${match.season}/${
            match.show
          } - S${match.season?.toString().padStart(2, "0")}E${match.episode
            ?.toString()
            .padStart(2, "0")}${match.title ? " - " + match.title : ""}.${
            match.extension
          }`;
        } else {
          to = `${match.title} (${match.year})/${match.title} (${match.year}) - ${match.resolution}.${match.extension}`;
        }
        console.log(`${from} ⇒ ${to}`);
        renames[fp] = path.join(this.basePath, to);
      }
    }
  }
}
