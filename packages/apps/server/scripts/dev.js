const path = require("path");
const { spawn } = require("@mh-cbon/aghfabsowecwn");

const cmd = "node.exe -r ts-node/register/transpile-only ./src/server.ts".split(
  " ",
);

const child = spawn(cmd[0], cmd.slice(1), {
  cwd: path.resolve(__dirname, ".."),
  env: {
    DEBUG: "*",
  },
  stdio: "pipe",
});

child.on("started", () => {
  console.log("===> child pid=%s", child.pid);
});

child.on("close", (code) => {
  console.log("===> child close code=%s", code);
  process.exit(code);
});

child.on("exit", (code) => {
  console.log("===> child exit code=%s", code);
  process.exit(code);
});

// if UAC is not validated, or refused, an error is emitted
child.on("error", (err) => {
  console.log("===> child error=%s", err);
  console.log("===> child error=%j", err);
  if (err.code === "ECONNREFUSED")
    console.log("UAC was probably not validated.");
});

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

function exitHandler(options) {
  console.log("exitHandler", options);
  if (options.exit) {
    child.emit("exit", 0);
  }
}

process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
