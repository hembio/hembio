import path from "path";
import { config } from "dotenv";
import { getCwd } from "./getCwd";
config({
  path: path.resolve(getCwd(), ".env"),
});
export function getEnv(): NodeJS.ProcessEnv {
  return process.env;
}
