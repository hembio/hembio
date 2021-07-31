const { mkdir, readdir, copyFile } = require("fs/promises");
const path = require("path");

async function copyDir(src, dest) {
  const entries = await readdir(src, { withFileTypes: true });
  await mkdir(dest, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

/** @type {import('@electron-forge/shared-types').ForgeConfig} */
module.exports = {
  makers: [
    // {
    //   name: "@electron-forge/maker-wix",
    //   config: {
    //     language: 1033,
    //     manufacturer: "hembio",
    //   },
    // },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "hembio",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.ts",
              name: "main_window",
            },
          ],
        },
        port: 3010,
        loggerPort: 9010,
      },
    ],
  ],
  hooks: {
    postPackage: async (_forgeConfig, _options) => {
      await copyDir(
        path.join(__dirname, "bin/mpv/win32"),
        path.join(__dirname, "out/hembio-win32-x64"),
      );
      //await copyDir(path.join(__dirname, "bin/darwin"), path.join(__dirname, "out/hembio-win32-x64"));
    },
  },
};
