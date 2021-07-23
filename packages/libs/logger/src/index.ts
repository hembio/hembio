import fs from "fs";
import path from "path";
import { getCwd } from "@hembio/core/src/utils/getCwd";
import { Logger } from "./Logger";

const loggers: Record<string, Logger> = {};

interface LoggerOptions {
  skipConsole?: boolean;
  mobx?: boolean;
}

fs.mkdirSync(path.join(getCwd(), "logs"), { recursive: true });

export const createLogger = (
  namespace: string,
  _options: LoggerOptions = {},
): Logger => {
  if (!loggers[namespace]) {
    const logger = new Logger(namespace);
    loggers[namespace] = logger;
  }
  return loggers[namespace];
};

export { Logger };

// export * as createDebug from "debug";
