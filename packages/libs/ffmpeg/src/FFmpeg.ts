import path from "path";
import { EventEmitter } from "eventemitter3";
import execa from "execa";
import {
  parseProgress,
  parseInfo,
  parseWriting,
  parseShortProgress,
} from "./parsers";
import { probe, ProbeResult } from "./probe";

export interface FFMpegOptions {
  cwd?: string;
  binPath?: string;
  input?: string;
  output?: string;
}

export class FFmpeg extends EventEmitter {
  public running = false;
  public status?: any;
  public process?: execa.ExecaChildProcess;
  public error?: string;
  public currentFile?: string;
  public log = "";

  public cwd = process.cwd();
  public binPath = path.resolve(
    __dirname,
    "../../../../bin/win64/ffmpeg/ffmpeg.exe",
  );
  public input = "";
  public output = "-";
  public outputOptions: string[] = [];
  public inputOptions: string[] = [];
  public globalOptions: string[] = [];

  public constructor(opts: FFMpegOptions = {}) {
    super();
    if (typeof opts.cwd !== "undefined") {
      this.cwd = opts.cwd;
    }
    if (typeof opts.binPath !== "undefined") {
      this.binPath = opts.binPath;
    }
  }

  public async probe(): Promise<ProbeResult> {
    const { input } = this;
    if (!input) {
      throw new Error("No input file specified");
    }
    const result = probe(input);
    this.emit("probe", result);
    return result;
  }

  public async run(): Promise<execa.ExecaChildProcess<string> | undefined> {
    const {
      cwd,
      binPath,
      input,
      output,
      globalOptions,
      inputOptions,
      outputOptions,
    } = this;

    if (!binPath) {
      throw Error("Missing path to ffmpeg binary");
    }

    if (!input) {
      throw new Error("No input specified");
    }

    if (!output) {
      throw new Error("No output specified");
    }

    if (this.process) {
      return this.process;
    }

    const args = [
      ...globalOptions
        .join(" ")
        .split(" ")
        .filter((a) => !!a),
      ...inputOptions
        .join(" ")
        .split(" ")
        .filter((a) => !!a),
      ...["-i", input],
      ...outputOptions
        .join(" ")
        .split(" ")
        .filter((a) => !!a),
      output,
    ];

    const joinedArgs: readonly string[] = args;
    try {
      this.emit("start", [binPath, ...joinedArgs]);
      console.log(binPath, joinedArgs.join(" "));
      this.process = execa(binPath, joinedArgs, { cwd });
      this.running = true;
    } catch (e) {
      this.emit("error", e);
      this.emit("exit");
      this.running = false;
    }

    if (output !== "-" && !output.includes("%d")) {
      this.currentFile = output;
    }

    this.awaitStatus();
    this.parseOutput();
    return this.process;
  }

  private async parseOutput() {
    if (this.process?.stderr) {
      let duration = 0;
      this.process.stderr.on("data", (data) => {
        const txt = data.toString();
        if (!duration) {
          const info = parseInfo(txt);
          if (info) {
            duration = info.duration;
          }
        }
        const progress = parseShortProgress(txt) || parseProgress(txt);
        if (progress) {
          this.emit("progress", {
            ...progress,
            duration,
            progress: Math.round((progress.time / duration) * 100 * 100) / 100,
          });
        }
        const writing = parseWriting(txt);
        if (writing) {
          if (this.currentFile && !writing.includes("%d")) {
            this.emit("done", this.currentFile);
          }
          this.currentFile = writing;
          this.emit("writing", writing);
        }
        this.log += txt;
      });
    }
  }

  private async awaitStatus() {
    if (this.process) {
      const status = await this.process.catch().finally();
      const code = this.process.exitCode;
      if (code === 1) {
        console.error("FFMPeg failed:", this.log);
      } else {
        this.emit("done", this.currentFile);
      }
      this.status = status;
      this.process = undefined;
      this.running = false;
      this.emit("exit", { code, error: this.error });
    }
  }

  public async stop(signal = 15): Promise<void> {
    // 2 is SIGINT, 9 is SIGKILL, 15 is SIGTERM
    if (this.running && this.process) {
      try {
        this.process.kill(signal);
        await this.process.finally();
      } catch (e) {
        this.emit("exit", { code: process.exitCode, error: this.error });
      }
    }
    this.process = undefined;
    this.running = false;
  }

  public setCwd(cwd: string): FFmpeg {
    this.cwd = cwd;
    return this;
  }

  public setInput(input: string): FFmpeg {
    this.input = input;
    return this;
  }

  public setOutput(output: string): FFmpeg {
    this.output = output;
    return this;
  }

  public setGlobalOptions(opts: string[]): FFmpeg {
    this.globalOptions = opts;
    return this;
  }

  public setInputOptions(opts: string[]): FFmpeg {
    this.inputOptions = opts;
    return this;
  }

  public setOutputOptions(opts: string[]): FFmpeg {
    this.outputOptions = opts;
    return this;
  }

  public async reset(): Promise<void> {
    this.input = "";
    this.output = "-";
    this.globalOptions = [];
    this.inputOptions = [];
    this.outputOptions = [];
    await this.stop(15);
  }
}
