import { Readable } from "stream";
import { drive_v3, google } from "googleapis";
import type { AuthPlus } from "googleapis/build/src/googleapis";
import { BaseFSAdapter, FSStatResult } from "../base";
import { GDrivePath } from "./GDrivePath";

export interface GDriveFSOptions {
  keyFile: string;
  driveId?: string;
  http2?: boolean;
  impersonate?: string;
}

interface GDriveReaddirOptions {
  pageSize?: number;
}

const DIR_MIME = "application/vnd.google-apps.folder";

interface CurrentPathEntry {
  id?: string;
  name?: string;
  mimeType?: string;
}

type MaybePromiseCallback = () => void | Promise<void>;

export class GDriveFSAdapter extends BaseFSAdapter {
  private auth: AuthPlus["GoogleAuth"];
  private api: drive_v3.Drive;
  private currentPath!: CurrentPathEntry[];
  private cwdUpdateHandler?: MaybePromiseCallback;
  public driveId?: string;

  public constructor(
    public basePath: string,
    { keyFile, http2 = false, impersonate }: GDriveFSOptions,
  ) {
    super(basePath);
    this.auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
      clientOptions: {
        subject: impersonate,
      },
    });

    google.options({
      http2,
    });
    this.api = google.drive({
      version: "v3",
      auth: this.auth,
    });
  }

  public async setDriveId(driveId: string): Promise<void> {
    if (driveId === "root") {
      const rootId = await this.getRootId();
      if (!rootId) {
        throw Error("Could not get rood ID");
      }
      this.driveId = rootId;
    } else {
      this.driveId = driveId;
    }
    this.currentPath = [{ id: this.driveId, name: "" }];
    this.setCurrentPath(new GDrivePath(this.basePath));
  }

  private getCurrentPath(): GDrivePath {
    const path = this.currentPath.map((path) => `${path.name}/`).join("");
    const cwd = new GDrivePath(path);
    return cwd;
  }

  private onCwdUpdate(
    handler: MaybePromiseCallback,
  ): MaybePromiseCallback | undefined {
    const prev = this.cwdUpdateHandler;
    if (handler) {
      this.cwdUpdateHandler = handler;
    }
    return prev;
  }

  private async fireCwdUpdate(): Promise<void> {
    if (this.cwdUpdateHandler) {
      try {
        const result = this.cwdUpdateHandler();
        if (result != null) {
          if (result.constructor === Promise) {
            return await result;
          }
          return result;
        }
      } catch {
        // Ignore
      }
    }
  }

  private async setCurrentPath(gdPath: GDrivePath): Promise<boolean> {
    if (!gdPath.isAbsolute()) {
      return false;
    }
    if (!(await this.isDirectory(gdPath))) {
      return false;
    }
    this.currentPath = await this.getPaths(gdPath);
    await this.fireCwdUpdate();
    return true;
  }

  private async isDirectory(gdPath: GDrivePath): Promise<boolean> {
    const file = await this.getFileOfPath(this.toAbsolutePath(gdPath));
    if (!file) {
      return false;
    }
    return file.mimeType === DIR_MIME;
  }

  private async findFileByName(
    parentFolderId: string,
    fileName: string,
  ): Promise<drive_v3.Schema$File[]> {
    const files: drive_v3.Schema$File[] = [];
    const q = [
      `parents in '${parentFolderId}'`,
      `name = '${fileName}'`,
      "trashed = false",
    ].join(" and ");

    const params: drive_v3.Params$Resource$Files$List = {
      pageSize: 10,
      pageToken: undefined,
      q: q,
      fields:
        "nextPageToken, " +
        "files(id, name, mimeType, size, modifiedTime, createdTime)",
    };

    do {
      const result = await this.getFileList(params);
      if (result.files) {
        for (const file of result.files) {
          files.push(file);
        }
      }
      params.pageToken = result.nextPageToken ?? undefined;
    } while (params.pageToken != null);

    return files;
  }

  private async getFileResource(
    params: drive_v3.Params$Resource$Files$Get,
  ): Promise<drive_v3.Schema$File> {
    params.supportsAllDrives = true;
    const response = await this.api.files.get(params);
    return response.data;
  }

  private async getFileList(
    params: drive_v3.Params$Resource$Files$List,
  ): Promise<drive_v3.Schema$FileList> {
    if (this.driveId) {
      // params.supportsAllDrives = true;
      // params.includeItemsFromAllDrives = true;
      // params.corpora = "drive";
      // params.driveId = this.driveId;
    }
    const response = await this.api.files.list(params);
    return response.data;
  }

  private async getFileByName(
    parentFolderId: string,
    fileName: string,
  ): Promise<drive_v3.Schema$File[]> {
    const files: drive_v3.Schema$File[] = [];
    const q = [
      `parents in '${parentFolderId}'`,
      `name = '${fileName}'`,
      "trashed = false",
    ].join(" and ");

    const params: drive_v3.Params$Resource$Files$List = {
      pageSize: 10,
      pageToken: undefined,
      q: q,
      fields:
        "nextPageToken, " +
        "files(id, name, mimeType, size, modifiedTime, createdTime)",
    };

    do {
      const result = await this.getFileList(params);
      if (result.files) {
        for (const file of result.files) {
          files.push(file);
        }
      }
      params.pageToken = result.nextPageToken ?? undefined;
    } while (params.pageToken != undefined);

    return files;
  }

  private async getPaths(gdPath: GDrivePath): Promise<CurrentPathEntry[]> {
    if (!gdPath.isAbsolute()) {
      return [];
    }
    const paths: CurrentPathEntry[] = [
      { id: this.driveId ?? "root", name: "", mimeType: DIR_MIME },
    ];
    for (const name of gdPath.elements().slice(1)) {
      if (name === "") {
        break;
      }
      const parent = paths.slice(-1)[0];
      const path: CurrentPathEntry = {
        id: undefined,
        name: undefined,
        mimeType: undefined,
      };
      if (parent.id) {
        const children = await this.findFileByName(parent.id, name);
        if (children.length > 0) {
          const child = children.shift();
          if (child) {
            path.id = child.id ?? undefined;
            path.name = child.name ?? undefined;
            path.mimeType = child.mimeType ?? undefined;
          }
        }
      }
      paths.push(path);
    }
    return paths;
  }

  private toAbsolutePath(path: GDrivePath): GDrivePath {
    if (path.isAbsolute()) {
      return path;
    }
    const cwd = this.getCurrentPath();
    return GDrivePath.merge(cwd, path);
  }

  private async getFileOfPath(
    gdPath: GDrivePath,
  ): Promise<CurrentPathEntry | undefined> {
    const paths = await this.getPaths(gdPath);
    if (!paths) {
      return undefined;
    }
    return paths.slice(-1)[0];
  }

  public async getRootId(): Promise<string | undefined> {
    const { data } = await this.api.files.get({ fileId: "root" });
    return data.id == null ? undefined : data.id;
  }

  public async stat(fsPath: string): Promise<FSStatResult | undefined> {
    fsPath = fsPath.replace(/\/+$/, "");
    const absPath = this.toAbsolutePath(new GDrivePath(fsPath));
    fsPath = absPath.toString();

    if (fsPath === "/") {
      const file = await this.getFileResource({
        fileId: "root",
        fields: "name, modifiedTime, createdTime",
      });
      return {
        isDirectory: () => true,
        isFile: () => false,
        size: Number(file.size),
        atime: new Date(1970),
        mtime: new Date(file.modifiedTime as string),
        ctime: new Date(file.createdTime as string),
      };
    }

    const parentFolder = await this.getFileOfPath(absPath.getPathPart());
    if (!parentFolder || parentFolder.id == null) {
      return undefined;
    }
    const filename = absPath.getFilename();
    if (filename) {
      const files = await this.findFileByName(parentFolder.id, filename);
      if (files.length === 0) {
        return undefined;
      }
      const file = files.shift();
      if (file) {
        return {
          isDirectory: () => file.mimeType === DIR_MIME,
          isFile: () => file.mimeType !== DIR_MIME,
          size: Number(file.size),
          atime: new Date(1970),
          mtime: new Date(file.modifiedTime as string),
          ctime: new Date(file.createdTime as string),
        };
      }
    }
    return undefined;
  }

  public async readdir(
    fsPath: string,
    options: GDriveReaddirOptions = {},
  ): Promise<string[]> {
    fsPath += fsPath.match(/\/$/) ? "" : "/";
    const absPath = this.toAbsolutePath(new GDrivePath(fsPath));
    const parentFolder = await this.getFileOfPath(absPath.getPathPart());

    if (!parentFolder || !parentFolder.id) {
      return [];
    }

    if (parentFolder?.mimeType !== DIR_MIME) {
      return [];
    }

    const paths: string[] = [];
    const pageSize = options.pageSize || 250;

    const params: drive_v3.Params$Resource$Files$List = {
      pageSize: pageSize <= 0 ? 250 : pageSize,
      pageToken: undefined,
      q: `parents in '${parentFolder.id}' and trashed = false`,
      fields: "nextPageToken, files(name)",
    };

    do {
      const res = await this.api.files.list(params);
      const nextPageToken = res.data.nextPageToken;
      const files = res.data.files || [];
      for (const file of files) {
        if (file.name) {
          paths.push(file.name);
        }
      }
      params.pageToken = nextPageToken ?? undefined;
    } while (params.pageToken != undefined);

    return paths;
  }

  public async createReadStream(
    fsPath: string,
    { start, end }: GDriveReadStreamOptions = {},
  ): Promise<Readable> {
    fsPath = fsPath.replace(/\/+$/, "");
    const absPath = this.toAbsolutePath(new GDrivePath(fsPath));
    fsPath = absPath.toString();
    const parentFolder = await this.getFileOfPath(absPath.getPathPart());
    if (!parentFolder || parentFolder.id == null) {
      throw Error("Parent not found");
    }

    const filename = absPath.getFilename();
    if (!filename) {
      throw Error("File not found");
    }

    const files = await this.findFileByName(parentFolder.id, filename);
    if (files.length === 0) {
      throw Error("File not found");
    }
    const file = files.shift() as drive_v3.Schema$File;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const fileId = file.id!;

    let rangeHeader = "";
    if (start && end) {
      rangeHeader = `bytes=${start}-${end}`;
    } else if (start) {
      rangeHeader = `bytes=${start}-`;
    } else if (end) {
      rangeHeader = `bytes=0-${end}`;
    }

    const stream = await this.api.files.get(
      { fileId },
      {
        params: { alt: "media" },
        responseType: "stream",
        headers: {
          Range: rangeHeader ? rangeHeader : undefined,
        },
      },
    );

    return stream.data;
  }

  public static async create(
    basePath: string,
    options: GDriveFSOptions,
  ): Promise<GDriveFSAdapter> {
    const fs = new GDriveFSAdapter(basePath, options);
    await fs.setDriveId(options.driveId || "root");
    return fs;
  }

  // TODO: Implement missing methods
}

interface GDriveReadStreamOptions {
  start?: number;
  end?: number;
}
