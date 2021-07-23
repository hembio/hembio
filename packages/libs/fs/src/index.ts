import { NodeFSAdapter, GDriveFSAdapter, GDriveFSOptions } from "./adapters";
export { NodeFSAdapter, GDriveFSAdapter };
export type { GDriveFSOptions };

type FSOptions = GDriveFSOptions | Record<string, unknown>;

const rxp = /$(node|gdrive):(.+)/;
export function createFS(
  fsPath: string,
  opts: FSOptions = {},
): NodeFSAdapter | GDriveFSAdapter {
  const matches = rxp.exec(fsPath);
  if (matches) {
    const adapter = matches[1];
    const basePath = matches[2];
    switch (adapter) {
      case "node":
        return new NodeFSAdapter(basePath);
      case "gdrive":
        return new GDriveFSAdapter(basePath, opts as GDriveFSOptions);
    }
  }
  throw Error("Unrecognized adapter");
}

export * from "./pathwalker";
