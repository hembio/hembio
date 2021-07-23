import { readdir, lstat } from "fs/promises";
import path from "path";

async function* walkPath(basePath: string) {
  try {
    for (const currentPath of await readdir(path.normalize(basePath))) {
      const fullPath = path.resolve(basePath, currentPath);
      const stat = lstat(fullPath);
      yield { path: fullPath, stat };
    }
  } catch {
    // Ignore
  }
}

interface PathWalkerOptions {
  yieldDir?: boolean;
  yieldFile?: boolean;
  depth?: number;
}

export async function* pathWalker(
  basePath: string,
  options: PathWalkerOptions = {},
): AsyncGenerator<string> {
  const { yieldDir = false, yieldFile = true, depth = Infinity } = options;
  try {
    for await (const { path, stat } of walkPath(basePath)) {
      const s = await stat;
      if (s.isDirectory()) {
        if (depth > 1) {
          yield* pathWalker(path, { ...options, depth: depth - 1 });
        }
        if (yieldDir) {
          yield path;
        }
      } else if (s.isFile() && yieldFile) {
        yield path;
      }
    }
  } catch {
    // Ignore
  }
}
