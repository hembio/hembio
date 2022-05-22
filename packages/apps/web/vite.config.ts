import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: `jsx`,
    jsxInject: `import { jsx } from "@emotion/react"; import React from "react";`,
  },
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: "./dist",
  },
  server: {
    host: "hembio.local",
    port: 3000,
    open: false,
    base: "https://hembio.local:3443",
    hmr: {
      clientPort: 3443,
      port: 4443,
      host: "hembio.local",
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
