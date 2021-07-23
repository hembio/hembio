import path from "path";
import { BaseFSReadStream } from "./BaseFSReadStream";

export class BaseFSAdapter implements IBaseFSAdapter {
  public constructor(public basePath: string) {}

  protected path(fsPath: string): string {
    return path.resolve(this.basePath, fsPath);
  }

  public async stat(_fsPath: string): Promise<FSStatResult | undefined> {
    throw Error("Not implemented");
  }

  public async lstat(fsPath: string): Promise<FSStatResult | undefined> {
    return this.stat(fsPath);
  }

  public async readdir(_fsPath: string): Promise<FSReadDirResult> {
    throw Error("Not implemented");
  }

  public async readFile(_fsPath: string): Promise<Buffer> {
    throw Error("Not implemented");
  }

  public async writeFile(
    _fsPath: string,
    _data: string | Uint8Array | Buffer,
  ): Promise<void> {
    throw Error("Not implemented");
  }

  public async unlink(_fsPath: string): Promise<void> {
    throw Error("Not implemented");
  }

  public async createReadStream(
    _fsPath: string,
    _opts: FSCreateReadStreamOptions,
  ): Promise<BaseFSReadStream> {
    throw Error("Not implemented");
  }
}

export interface IBaseFSAdapter {
  stat(fsPath: string): Promise<FSStatResult | undefined>;
  lstat(fsPath: string): Promise<FSStatResult | undefined>;
  unlink(fsPath: string): Promise<void>;
  readdir(fsPath: string): Promise<FSReadDirResult>;
  readFile(fsPath: string): Promise<Buffer>;
  writeFile(fsPath: string, data: Buffer): Promise<void>;
  createReadStream(
    fsPath: string,
    opts?: FSCreateReadStreamOptions,
  ): Promise<BaseFSReadStream>;
}

export interface FSStatResult {
  isDirectory(): boolean;
  isFile(): boolean;
  size: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
}

export type FSReadDirResult = string[];

export interface FSCreateReadStreamOptions {
  start: number;
  end: number;
}
