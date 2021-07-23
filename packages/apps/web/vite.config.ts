import path from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
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
  // optimizeDeps: {
  //   include: [
  //     "fast-json-stable-stringify",
  //     "@apollo/client",
  //     "zen-observable",
  //     "@apollo/client/core",
  //     "@apollo/client/cache",
  //     "@apollo/client/link/ws",
  //     "@apollo/client/link/context",
  //     "@apollo/client/utilities",
  //     "@material-ui/core",
  //     "@material-ui/core/colors",
  //   ],
  //   exclude: [
  //     "@mikro-orm/core",
  //     "@mikro-orm/reflection",
  //     "@mikro-orm/sqlite",
  //     "reflect-metadata",
  //     "dotenv",
  //     "uuid",
  //     "bcrypt",
  //     "graphql",
  //     "type-graphql",
  //     "slug",
  //   ],
  // },
});
