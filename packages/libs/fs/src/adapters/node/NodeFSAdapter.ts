import fs, { promises } from "fs";
import {
  FSCreateReadStreamOptions,
  FSReadDirResult,
  FSStatResult,
  IBaseFSAdapter,
  BaseFSAdapter,
} from "..";
import { BaseFSReadStream } from "../base/BaseFSReadStream";

export class NodeFSAdapter extends BaseFSAdapter implements IBaseFSAdapter {
  public async stat(fsPath: string): Promise<FSStatResult> {
    const s = await promises.stat(this.path(fsPath));
    return {
      isDirectory: s.isDirectory,
      isFile: s.isFile,
      size: s.size,
      atime: s.atime,
      mtime: s.mtime,
      ctime: s.ctime,
    };
  }

  public async lstat(fsPath: string): Promise<FSStatResult> {
    const s = await promises.lstat(this.path(fsPath));
    return {
      isDirectory: s.isDirectory,
      isFile: s.isFile,
      size: s.size,
      atime: s.atime,
      mtime: s.mtime,
      ctime: s.ctime,
    };
  }

  public async unlink(fsPath: string): Promise<void> {
    return promises.unlink(this.path(fsPath));
  }

  public async mkdir(fsPath: string): Promise<string | undefined> {
    return promises.mkdir(this.path(fsPath), { recursive: true });
  }

  public async readdir(fsPath: string): Promise<FSReadDirResult> {
    return promises.readdir(this.path(fsPath));
  }

  public async readFile(fsPath: string): Promise<Buffer> {
    return promises.readFile(this.path(fsPath));
  }

  public async writeFile(
    fsPath: string,
    data: string | Uint8Array | Buffer,
  ): Promise<void> {
    return promises.writeFile(this.path(fsPath), data);
  }

  public async createReadStream(
    fsPath: string,
    opts: FSCreateReadStreamOptions,
  ): Promise<BaseFSReadStream> {
    const rs = fs.createReadStream(this.path(fsPath), opts);
    return rs;
  }

  // TODO: Implement missing methods
}
