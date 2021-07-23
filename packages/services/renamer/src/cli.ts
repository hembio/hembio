import { Renamer } from "./Renamer";

async function main() {
  const renamer = new Renamer("G:\\My Drive\\media\\Unsorted");
  await renamer.start();
  console.log("Done!");
  process.exit(0);
}

// const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
// let curFrame = 0;
// const spinner = observable.box(frames[0]);
// setInterval(() => {
//   curFrame = curFrame + 1;
//   if (curFrame >= frames.length) {
//     curFrame = 0;
//   }
//   spinner.set(frames[curFrame]);
// }, 1000 / 15);

// const start = Date.now();
// autorun(
//   () => {
//     return;
//     const { stdout } = process;
//     const write = stdout.write.bind(stdout);
//     const logEntries = logger.mobx?.entries;
//     write(
//       `${spinner} Time running: ${Math.floor((Date.now() - start) / 1000)}s\n`,
//     );
//     write("\n");
//     logEntries
//       ?.slice(Math.max(logEntries.length - 5, 0))
//       .map((e) => console.log(`${e.level}:`, e.message));
//   },
//   { delay: 1000 / 15 },
// );

main();
