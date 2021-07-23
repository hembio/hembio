/* eslint-disable @typescript-eslint/no-explicit-any */
import pino from "pino";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import pinoPretty from "pino-pretty";

export class BrowserLogger {
  private loggers: pino.Logger[] = [];

  constructor(private namespace: string) {
    this.loggers.push(
      pino({
        name: this.namespace,
        level: "debug",
        prettyPrint: true,
        prettifier: pinoPretty,
      }),
    );
  }

  log(message: string): void;
  log(firstArg: unknown, ...rest: unknown[]): void {
    for (const logger of this.loggers) {
      logger.log(firstArg as any, ...rest);
    }
  }

  info(message: string): void;
  info(firstArg: unknown, ...rest: unknown[]): void {
    for (const logger of this.loggers) {
      logger.info(firstArg as any, ...rest);
    }
  }

  debug(message: string): void;
  debug(firstArg: unknown, ...rest: unknown[]): void {
    for (const logger of this.loggers) {
      logger.debug(firstArg as any, ...rest);
    }
  }

  error(message: string): void;
  error(firstArg: unknown, ...rest: unknown[]): void {
    for (const logger of this.loggers) {
      logger.error(firstArg as any, ...rest);
    }
  }
}
