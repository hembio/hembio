import chokidar from "chokidar";

const watcher = chokidar.watch(["G:\\My Drive\\media"], {
  ignored: /(^|[/\\])\../,
  persistent: true,
  usePolling: false,
  interval: 10000,
  disableGlobbing: false,
  awaitWriteFinish: true,
  ignorePermissionErrors: true,
  ignoreInitial: true,
});

watcher
  .on("addDir", (path) => console.log(`Directory ${path} has been added`))
  .on("unlinkDir", (path) => console.log(`Directory ${path} has been removed`))
  .on("ready", () => console.log("FileWatcher is ready"));
