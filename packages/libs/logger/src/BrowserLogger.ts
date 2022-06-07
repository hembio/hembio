/* eslint-disable @typescript-eslint/no-explicit-any */
import pino from "pino";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import pinoPretty from "pino-pretty";

export class BrowserLogger {
  private loggers: pino.Logger[] = [];

  public constructor(private namespace: string) {
    this.loggers.push(
      pino({
        name: this.namespace,
        level: "debug",
        prettyPrint: true,
        prettifier: pinoPretty,
      }),
    );
  }

  public log(message: string): void;
  public log(firstArg: unknown, ...rest: unknown[]): void {
    for (const logger of this.loggers) {
      logger.log(firstArg as any, ...rest);
    }
  }

  public info(message: string): void;
  public info(firstArg: unknown, ...rest: unknown[]): void {
    for (const logger of this.loggers) {
      logger.info(firstArg as any, ...rest);
    }
  }

  public debug(message: string): void;
  public debug(firstArg: unknown, ...rest: unknown[]): void {
    for (const logger of this.loggers) {
      logger.debug(firstArg as any, ...rest);
    }
  }

  public error(message: string): void;
  public error(firstArg: unknown, ...rest: unknown[]): void {
    for (const logger of this.loggers) {
      logger.error(firstArg as any, ...rest);
    }
  }
}
