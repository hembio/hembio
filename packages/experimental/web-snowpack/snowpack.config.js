/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: "/dist",
    "../../libs/core/src": "/@hembio/core",
    "../../libs/logger/src": "/@hembio/logger",
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-typescript",
  ],
  alias: {
    "@hembio/core": "../../libs/core/src",
    "@hembio/logger": "../../libs/logger/src",
    "~/public": "./public",
    "~": "./src",
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    // { match: "routes", src: ".*", dest: "/index.html" },
  ],
  optimize: {
    treeshake: true,
  },
  packageOptions: {
    polyfillNode: true,
    env: { NODE_ENV: true },
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    clean: true,
  },
};
