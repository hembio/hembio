import * as hostile from "hostile";

export async function ensureHost(
  host = "hembio.local",
  ip = "127.0.0.1",
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    hostile.set(ip, host, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
