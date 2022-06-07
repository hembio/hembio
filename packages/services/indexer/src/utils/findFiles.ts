import { Stats, promises as fs } from "fs";
import os from "os";
import path from "path";
import PQueue from "p-queue";

const concurrency = Math.max(4, Math.ceil(os.cpus().length / 2));
const queue = new PQueue({ concurrency, autoStart: true });

type GenReturn = [string, Promise<Stats>];
export async function* findFilesGenerator(
  bp: string,
): AsyncGenerator<GenReturn> {
  for (const cp of await fs.readdir(bp)) {
    if (cp) {
      const fp = path.join(bp, cp);
      const stat = fs.lstat(fp);
      yield [fp, stat];
    }
  }
}

export async function findFiles(
  basePath: string,
  matcher?: RegExp,
): Promise<{ files: string[]; total: number; dirs: number }> {
  try {
    const stat = await fs.lstat(basePath);
    if (!stat.isDirectory()) {
      throw Error("Base path is not a directory");
    }
  } catch (e) {
    throw Error("Failed to stat base directory");
  }

  let total = 0;
  let dirs = 0;
  const files: string[] = [];
  const readDirRecursive = async (bp: string): Promise<void> => {
    for await (const [fp, stat] of findFilesGenerator(bp)) {
      queue.add(
        async () => {
          const s = await stat;
          if (s.isDirectory()) {
            dirs++;
            queue.add(() => readDirRecursive(fp));
          } else if (s.isFile()) {
            total++;
            if (!matcher || matcher.test(fp)) {
              files.push(fp);
            }
          }
        },
        { priority: 10 },
      );
    }
  };
  queue.add(() => readDirRecursive(basePath));
  await queue.onIdle();
  return { files: files, total, dirs };
}
