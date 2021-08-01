const splitPath = (fsPath: string): string[] => {
  if (!fsPath) {
    throw new Error("Invalid pathname. It should not be empty.");
  }
  const paths: string[] = [];
  let escaped = false;
  let i = 0;
  let element = "";
  const chars = fsPath.split("");
  while (i < chars.length) {
    const c = chars[i];
    if (escaped) {
      element += c;
      escaped = false;
    } else if (c === "\\") {
      escaped = true;
    } else if (c === "/") {
      paths.push(element);
      element = "";
    } else {
      element += c;
    }
    i++;
  }
  paths.push(element);
  if (escaped) {
    throw new Error(`Invalid pathname ${fsPath}`);
  }
  return paths;
};

export class GDrivePath {
  private lastSlash = true;
  private absolute = true;
  private paths: string[] = [];

  public constructor(fsPath: string) {
    this.parse(fsPath);
  }

  public isAbsolute(): boolean {
    return this.absolute;
  }

  public isDirSpec(): boolean {
    return this.lastSlash;
  }

  public getPathPart(): GDrivePath {
    if (this.lastSlash) {
      return new GDrivePath(this.toString());
    }
    const paths = this.elements();
    paths.splice(-1, 1, "");
    return new GDrivePath(paths.join("/"));
  }

  public getFilename(): string | undefined {
    return this.elements().pop();
  }

  public elements(): string[] {
    const elements = this.paths.map((item) => item);
    if (this.absolute) {
      elements.unshift("");
    }
    if (this.lastSlash) {
      elements.push("");
    }
    return elements;
  }

  public parse(pathname: string): void {
    let paths = splitPath(pathname.replace(/\/+/g, "/"));
    const lastSlash = paths[paths.length - 1] === "";
    const absolute = paths[0] === "";
    if (lastSlash) {
      paths.pop();
    }
    if (absolute) {
      paths.shift();
    }
    this.lastSlash = !!lastSlash;
    this.absolute = !!absolute;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let replacement = false;
      if (paths.length >= 2) {
        paths = paths.reduce((acc, next) => {
          if (!Array.isArray(acc)) {
            acc = [acc];
          }
          const last = acc[acc.length - 1];
          if (last !== ".." && next === "..") {
            acc.pop();
            replacement = true;
          } else if (last !== "." && next === ".") {
            replacement = true;
          } else {
            acc.push(next);
          }
          return acc;
        }, [] as string[]);
      }
      if (!replacement) {
        this.paths = paths;
        break;
      }
    }
  }

  public toString(): string {
    if (this.paths.length === 0) {
      return "/";
    }
    const rootSpec = this.absolute ? "/" : "";
    const dirSpec = this.lastSlash ? "/" : "";
    const fsPath = `${rootSpec}${this.paths.join("/")}${dirSpec}`;
    return fsPath;
  }

  public static merge(...paths: Array<string | GDrivePath>): GDrivePath {
    const gdPath = paths.reduce((pathA, pathB) => {
      if (typeof pathA === "string") {
        pathA = new GDrivePath(pathA);
      }
      if (typeof pathB === "string") {
        pathB = new GDrivePath(pathB);
      }
      const a = pathA.toString();
      const b = pathB.toString();
      if (pathB.isAbsolute()) {
        return new GDrivePath(b);
      }
      const joined = new GDrivePath([a, b].join("/"));
      return joined;
    }) as GDrivePath;
    return gdPath;
  }
}
