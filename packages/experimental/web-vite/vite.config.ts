import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import vitePluginMaterialUi from "vite-plugin-material-ui";

export default defineConfig({
  plugins: [reactRefresh(), vitePluginMaterialUi as any],
  root: "src",
  build: {
    outDir: "../dist",
  },
  server: {
    open: "/",
  },
  alias: {
    "~": "src",
  },
  optimizeDeps: {
    link: ["@hembio/core"],
    include: [
      "fast-json-stable-stringify",
      "@apollo/client",
      "zen-observable",
      "@apollo/client/core",
      "@apollo/client/cache",
      "@apollo/client/link/ws",
      "@apollo/client/link/context",
      "@apollo/client/utilities",
      "@material-ui/core",
      "@material-ui/core/colors",
    ],
    exclude: [
      "@mikro-orm/core",
      "@mikro-orm/reflection",
      "@mikro-orm/sqlite",
      "reflect-metadata",
      "dotenv",
      "uuid",
      "bcrypt",
      "graphql",
      "type-graphql",
      "slug",
    ],
  },
});
