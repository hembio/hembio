// import hashColor from 'hash-color-material';
import "pino-debug";
import { BrowserLogger } from "./BrowserLogger";

const loggers: Record<string, BrowserLogger> = {};

export const getLogger = (namespace: string): BrowserLogger => {
  if (!loggers[namespace]) {
    const logger = new BrowserLogger(namespace);
    loggers[namespace] = logger;
  }
  return loggers[namespace];
};
