import path from "path";
export function getCwd(): string {
  if (process.env.NODE_ENV === "production") {
    return process.cwd();
  } else {
    return path.resolve(__dirname, "../../../../../");
  }
}
