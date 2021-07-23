const path = require("path");
const {
  override,
  babelInclude,
  removeModuleScopePlugin,
  addDecoratorsLegacy,
  disableEsLint,
  addBundleVisualizer,
  adjustWorkbox,
  addWebpackAlias,
  // addWebpackPlugin,
} = require("customize-cra");
// const DynamicCdnWebpackPlugin = require("@talend/dynamic-cdn-webpack-plugin");

module.exports = {
  webpack: override(
    disableEsLint(),
    addDecoratorsLegacy(),
    // addWebpackPlugin(new DynamicCdnWebpackPlugin()),
    process.env.BUNDLE_VISUALIZE === "1" && addBundleVisualizer(),
    babelInclude([
      path.resolve(__dirname, "./src"),
      // @hembio/core
      path.resolve(__dirname, "../../libs/core/src"),
      // @hembio/db
      path.resolve(__dirname, "../../libs/db/src"),
      // @hembio/logger
      path.resolve(__dirname, "../../libs/logger/src"),
    ]),
    removeModuleScopePlugin(),

    // adjust the underlying workbox
    adjustWorkbox((wb) =>
      Object.assign(wb, {
        skipWaiting: true,
        clientsClaim: true,
        exclude: (wb.exclude || []).concat("index.html"),
      }),
    ),

    // add aliases
    addWebpackAlias({
      ["$"]: path.resolve(__dirname, "public"),
      ["~"]: path.resolve(__dirname, "src"),
    }),

    // Replace babel-loader with swc-loader
    // function (config) {
    //   return config;
    //   config.module.rules.forEach((rule) => {
    //     if (rule.oneOf) {
    //       rule.oneOf.forEach((rule) => {
    //         if (!rule.loader || !rule.test) {
    //           return;
    //         }
    //         if (!rule.test.toString().includes("ts|tsx")) {
    //           return;
    //         }
    //         if (rule.loader.includes("babel-loader")) {
    //           rule.test = /\.tsx?$/;
    //           rule.loader = require.resolve("swc-loader");
    //           rule.options = {
    //             jsc: {
    //               target: "es2018",
    //               loose: true,
    //               parser: {
    //                 syntax: "typescript",
    //                 tsx: true,
    //                 decorators: true,
    //                 dynamicImport: false,
    //               },
    //               transform: {
    //                 legacyDecorator: true,
    //                 decoratorMetadata: true,
    //               },
    //             },
    //             // module: {
    //             //   type: "commonjs",
    //             // },
    //             // exclude: ["__tests__"],
    //           };
    //         }
    //       });
    //     }
    //   });
    //   return config;
    // },
  ),
  // The paths config to use when compiling your react app
  //  for development or production.
  paths(paths) {
    // ...add your paths config
    paths.appBuild = path.resolve(__dirname, "dist");
    return paths;
  },
};
