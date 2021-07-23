import readline from "readline";

type BeforeExitFn = () => void | Promise<void>;

const beforeExitFns: Array<BeforeExitFn> = [];

// Ensure SIGINT is emitted on Windows
if (
  process.platform === "win32" &&
  process.stdin.isTTY &&
  process.env.NODE_ENV !== "test"
) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.emit("beforeExit" as any);
  });
}

process.on("beforeExit", async () => {
  for (const fn of beforeExitFns) {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
  }
  process.exit(0);
});

export function beforeExit(fn: BeforeExitFn): void {
  beforeExitFns.push(fn);
}
