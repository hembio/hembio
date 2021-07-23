/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/electron/electron/issues/2288
export function isElectron(): boolean {
  // Renderer process
  if (
    typeof window !== "undefined" &&
    typeof window.process === "object" &&
    (window.process as any).type === "renderer"
  ) {
    return true;
  }

  // Main process
  if (
    typeof process !== "undefined" &&
    typeof process.versions === "object" &&
    !!process.versions.electron
  ) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to false
  if (
    typeof navigator === "object" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent.indexOf("Electron") >= 0
  ) {
    return true;
  }

  return false;
}
