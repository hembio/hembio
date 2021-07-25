/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";

export const PLUGIN_MIME_TYPE = "application/x-mpv";

function containsNonASCII(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      return true;
    }
  }
  return false;
}

export function getPluginEntry(pluginDir: string, pluginName = "mpv.node") {
  const fullPluginPath = path.join(pluginDir, pluginName);
  // Try relative path to workaround ASCII-only path restriction.
  let pluginPath = path.relative(process.cwd(), fullPluginPath);
  if (path.dirname(pluginPath) === ".") {
    // "./plugin" is required only on Linux.
    if (process.platform === "linux") {
      pluginPath = `.${path.sep}${pluginPath}`;
    }
  } else {
    // Relative plugin paths doesn't work reliably on Windows, see
    // <https://github.com/Kagami/mpv.js/issues/9>.
    if (process.platform === "win32") {
      pluginPath = fullPluginPath;
    }
  }
  if (containsNonASCII(pluginPath)) {
    if (containsNonASCII(fullPluginPath)) {
      throw new Error("Non-ASCII plugin path is not supported");
    } else {
      pluginPath = fullPluginPath;
    }
  }
  return `${pluginPath};${PLUGIN_MIME_TYPE}`;
}
