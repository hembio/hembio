import crypto from "crypto";
import fs from "fs";

export function getFileChecksum(
  filePath: string,
  algorithm = "sha1",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const readStream = fs
      .createReadStream(filePath)
      .on("error", reject)
      .pipe(crypto.createHash(algorithm).setEncoding("hex"))
      .once("finish", () => {
        resolve(readStream.read());
      });
  });
}
