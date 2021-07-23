const isVite = !!import.meta;
const env = import.meta ? import.meta.env : process.env;
export const HEMBIO_API_URL =
  (isVite ? env.VITE_HEMBIO_API_URL : env.REACT_APP_HEMBIO_API_URL) ||
  "http://localhost:4000";
export const HEMBIO_WS_URL =
  (isVite ? env.VITE_HEMBIO_WS_URL : env.REACT_APP_HEMBIO_WS_URL) ||
  "ws://localhost:4000";
