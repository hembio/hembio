/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-spread */
/* eslint-disable prefer-rest-params */
import path from "path";
import { getCwd } from "@hembio/core";
import { LoggerService } from "@nestjs/common";
import pino, { destination, final } from "pino";
// eslint-disable-next-line
// @ts-ignore-line
import pinoPretty from "pino-pretty";

export class Logger implements LoggerService {
  private namespace: string;
  // Note: Do not remove. Needed by LoggerService
  private args: Array<unknown> = [];
  private loggers: Array<pino.Logger> = [];

  public constructor(...args: unknown[]) {
    this.namespace = args[0] as string;
    this.args = args;

    const fileLogger = pino(
      { name: this.namespace, level: "debug" },
      destination({
        dest: path.join(getCwd(), "logs", `${this.namespace}.log`),
        minLength: 4096,
        sync: false,
      }),
    );

    // asynchronously flush every 10 seconds to keep the buffer empty
    // in periods of low activity
    setInterval(function () {
      try {
        fileLogger.flush();
      } catch {
        // Ignore
      }
    }, 10000).unref();

    // use pino.final to create a special logger that
    // guarantees final tick writes
    const handler = final(fileLogger, (err, finalLogger, evt) => {
      try {
        finalLogger.info(`${evt} caught`);
        if (err) finalLogger.error(err, "error caused exit");
      } catch {
        // Ignore
        console.error(evt, err);
      }
      process.exit(err ? 1 : 0);
    });

    // catch all the ways node might exit
    process.on("beforeExit", () => handler(null, "beforeExit"));
    process.on("exit", () => handler(null, "exit"));
    process.on("uncaughtException", (err) => handler(err, "uncaughtException"));
    // process.on("unhandledRejection", (reason, promise) => {
    //   this.error({ promise, reason }, "Unhandled Rejection");
    //   handler(null, "unhandledRejection");
    // });
    process.on("SIGINT", () => handler(null, "SIGINT"));
    process.on("SIGQUIT", () => handler(null, "SIGQUIT"));
    process.on("SIGTERM", () => handler(null, "SIGTERM"));

    const terminalLogger = pino({
      name: this.namespace,
      level: "debug",
      prettyPrint: {
        translateTime: "HH:MM:ss.l",
      },
      prettifier: pinoPretty,
    });

    this.loggers.push(fileLogger, terminalLogger);
  }

  public log(message: string): void;
  public log(message: string, ...rest: unknown[]): void;
  public log<T>(firstArg: T): void;
  public log<T>(firstArg: T, ...rest: unknown[]): void;
  public log(...rest: any[]): void {
    for (const logger of this.loggers) {
      logger.debug.apply(logger, rest as any);
    }
  }

  public info(message: string): void;
  public info(message: string, ...rest: unknown[]): void;
  public info<T>(firstArg: T): void;
  public info<T>(firstArg: T, ...rest: unknown[]): void;
  public info(...rest: any[]): void {
    for (const logger of this.loggers) {
      logger.info.apply(logger, rest as any);
    }
  }

  public debug(message: string): void;
  public debug(message: string, ...rest: any[]): void;
  public debug<T>(arg: T): void;
  public debug<T>(firstArg: T, ...rest: unknown[]): void;
  public debug(...rest: any[]): void {
    for (const logger of this.loggers) {
      logger.debug.apply(logger, rest as any);
    }
  }

  public verbose(message: string): void;
  public verbose(message: string, ...rest: unknown[]): void;
  public verbose<T>(firstArg: T): void;
  public verbose<T>(firstArg: T, ...rest: unknown[]): void;
  public verbose(...rest: any[]): void {
    for (const logger of this.loggers) {
      logger.verbose.apply(logger, rest as any);
    }
  }

  public warn(message: string): void;
  public warn(message: string, ...rest: unknown[]): void;
  public warn<T>(firstArg: T): void;
  public warn<T>(firstArg: T, ...rest: unknown[]): void;
  public warn(...rest: any[]): void {
    for (const logger of this.loggers) {
      logger.warn.apply(logger, rest as any);
    }
  }

  public error(error: Error): void;
  public error(error: Error, ...rest: unknown[]): void;
  public error(message: string): void;
  public error(message: string, ...rest: unknown[]): void;
  public error<T>(firstArg: T): void;
  public error<T>(firstArg: T, ...rest: unknown[]): void;
  public error(...rest: any[]): void {
    for (const logger of this.loggers) {
      logger.error.apply(logger, rest as any);
    }
  }

  public fatal(error: Error): void;
  public fatal(error: Error, ...rest: unknown[]): void;
  public fatal(message: string): void;
  public fatal(message: string, ...rest: unknown[]): void;
  public fatal<T>(firstArg: T): void;
  public fatal<T>(firstArg: T, ...rest: unknown[]): void;
  public fatal(...rest: any[]): void {
    for (const logger of this.loggers) {
      logger.fatal.apply(logger, rest as any);
    }
  }

  public trace(message: string): void;
  public trace(message: string, ...rest: unknown[]): void;
  public trace<T>(firstArg: T): void;
  public trace<T>(firstArg: T, ...rest: unknown[]): void;
  public trace(...rest: any[]): void {
    for (const logger of this.loggers) {
      logger.trace.apply(logger, rest as any);
    }
  }

  public child(): Logger {
    return new Logger(this.namespace);
  }
}
