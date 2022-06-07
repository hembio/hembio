import { existsSync, writeFileSync, readFileSync, mkdirSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { beforeExit } from "~/utils/beforeExit";
import { LRU } from "./LRU";

export class FileLRU<T> extends LRU<T> {
  public constructor(private filename: string, size = 20, ttl = Infinity) {
    super(size, ttl);
    beforeExit(() => {
      this.saveSync();
    });
    this.loadSync();
  }

  public async load(): Promise<void> {
    try {
      this.values = new Map(
        JSON.parse((await fs.readFile(this.filename)).toString()),
      );
    } catch {
      // Do nothing
    }
  }

  public async loadSync(): Promise<void> {
    try {
      this.values = new Map(JSON.parse(readFileSync(this.filename).toString()));
    } catch {
      // Do nothing
    }
  }

  public async save(): Promise<void> {
    if (!existsSync(path.dirname(this.filename))) {
      try {
        await fs.mkdir(path.dirname(this.filename), { recursive: true });
      } catch {
        // Do nothing
      }
    }
    try {
      await fs.writeFile(this.filename, JSON.stringify([...this.values]));
    } catch {
      // Do nothing
    }
  }

  public saveSync(): void {
    try {
      mkdirSync(path.dirname(this.filename), { recursive: true });
    } catch {
      // Do nothing
    }
    writeFileSync(this.filename, JSON.stringify([...this.values]));
  }
}
