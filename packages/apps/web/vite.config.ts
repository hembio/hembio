import path from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: `jsx`,
    jsxInject: `import { jsx } from "@emotion/react"; import React from "react";`,
  },
  plugins: [reactRefresh()],
  root: path.resolve(__dirname),
  build: {
    outDir: "./dist",
  },
  server: {
    port: 3000,
    open: false,
    base: "https://hembio.local:3443",
    hmr: {
      port: 3443,
    },
    fs: {
      allow: [path.resolve("../../../")],
      strict: true,
    },
  },
  resolve: {
    alias: {
      "~": path.resolve("./src"),
      $: path.resolve("./public"),
    },
  },
});
