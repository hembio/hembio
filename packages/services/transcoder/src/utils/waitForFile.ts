import fs from "fs";
import path from "path";

const waiters: Record<string, Promise<boolean>> = {};

export async function waitForFile(
  filePath: string,
  timeout = 30000,
): Promise<boolean> {
  // Early out if file exists
  if (fs.existsSync(filePath)) {
    return true;
  }

  if (waiters[filePath]) {
    return waiters[filePath];
  }

  let timer: NodeJS.Timeout;
  waiters[filePath] = new Promise<boolean>((resolve, reject) => {
    let watcher: fs.FSWatcher;
    timer = setTimeout(() => {
      if (watcher) {
        watcher.close();
      }
      reject(
        new Error("File did not exists and was not created before timeout."),
      );
    }, timeout);

    const dir = path.dirname(filePath);
    const basename = path.basename(filePath);
    try {
      watcher = fs.watch(dir, (eventType, filename) => {
        if (eventType === "rename" && filename === basename) {
          clearTimeout(timer);
          watcher.close();
          resolve(true);
        }
      });
    } catch (e) {
      // Ignore
      resolve(true);
    }
  }).then((result) => {
    clearTimeout(timer);
    delete waiters[filePath];
    return result;
  });
  return waiters[filePath];
}
