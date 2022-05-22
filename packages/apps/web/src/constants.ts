const isVite = !!import.meta;
const env = import.meta ? (import.meta as any).env : process.env;
export const HEMBIO_API_URL =
  (isVite ? env.VITE_HEMBIO_API_URL : env.REACT_APP_HEMBIO_API_URL) ||
  "https://hembio.local:3443/api";
export const HEMBIO_WS_URL =
  (isVite ? env.VITE_HEMBIO_WS_URL : env.REACT_APP_HEMBIO_WS_URL) ||
  "wss://hembio.local:3443";
