import { createReadStream, createWriteStream } from "fs";
import { unlink, mkdir } from "fs/promises";
import path from "path";
import zlib from "zlib";
import execa from "execa";
import { globby } from "globby";
import * as tar from "tar-stream";

async function untar(archive: string, target: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const extract = tar.extract();
    extract.on("entry", async (header: any, stream: any, next: any) => {
      stream.on("end", function () {
        next(); // ready for next entry
      });
      const targetFile = path.join(target, header.name.replace("package/", ""));
      await mkdir(path.dirname(targetFile), {
        recursive: true,
      });
      stream.pipe(createWriteStream(targetFile));
    });
    extract.on("finish", async () => {
      resolve();
      await unlink(archive);
    });
    createReadStream(archive).pipe(zlib.createGunzip()).pipe(extract);
  });
}

async function run(cmd: string) {
  const args = cmd.split(" ");
  console.log(`executing: ${cmd}`);
  const sp = execa(args.shift() as string, args);
  sp.stdout?.pipe(process.stdout);
  sp.stderr?.pipe(process.stderr);
  try {
    await sp;
  } catch {
    process.exit(1);
  }
}

async function main() {
  await run("yarn clean");
  await run("yarn workspaces foreach -pt --all run build");
  const exclude = ["@hembio/web-app", "@hembio/desktop-app"];
  await run(
    `yarn workspaces foreach -pt --all --exclude ${exclude.join(
      " --exclude ",
    )} pack`,
  );
  const packages = await globby("packages/**/package.tgz");
  for (const p of packages) {
    const matches = /packages\/(?<pkg>.*)\/package.tgz$/.exec(p);
    if (matches && matches.groups) {
      const { pkg } = matches.groups;
      switch (pkg) {
        case "server":
          await untar(p, path.resolve(__dirname, "../build"));
          break;
        default:
          await untar(
            p,
            path.join(__dirname, "../build", "node_modules", `@hembio/${pkg}`),
          );
      }
    }
  }
}

main();
