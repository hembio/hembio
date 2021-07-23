import { getEnv } from "@hembio/core";
import * as pkg from "../package.json";

const env = getEnv();
export const HEMBIO_JWT_SECRET = env.HEMBIO_JWT_SECRET || "change me";
export const HEMBIO_API_VERSION = pkg.version;
export const HEMBIO_BANNER = `
 __                    __     __
|  |--.-----.--------.|  |--.|__|.-----.
|     |  -__|        ||  _  ||  ||  _  |
|__|__|_____|__|__|__||_____||__||_____| v${HEMBIO_API_VERSION}
                                        `;
