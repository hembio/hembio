import pkg from "../package.json";

export const HEMBIO_SERVER_VERSION = pkg.version;
export const HEMBIO_BANNER = `
 __                    __     __
|  |--.-----.--------.|  |--.|__|.-----.
|     |  -__|        ||  _  ||  ||  _  |
|__|__|_____|__|__|__||_____||__||_____| v${HEMBIO_SERVER_VERSION}
                                        `;
