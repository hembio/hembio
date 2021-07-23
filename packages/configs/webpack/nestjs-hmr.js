const path = require("path");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");

module.exports = (dirname = __dirname, config = {}) =>
  merge(
    {
      entry: ["webpack/hot/poll?100", "./src/main.ts"],
      target: "node",
      externalsPresets: { node: true },
      externals: [
        nodeExternals({
          allowlist: ["webpack/hot/poll?100"],
          modulesDir: "../../../node_modules",
          additionalModuleDirs: ["node_modules"],
        }),
      ],
      module: {
        rules: [
          {
            test: /.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
          },
        ],
      },
      mode: "development",
      resolve: {
        extensions: [".tsx", ".ts", ".js"],
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new RunScriptWebpackPlugin({ name: "server.js" }),
      ],
      output: {
        path: path.join(dirname, "dist"),
        filename: "server.js",
      },
    },
    config,
  );
