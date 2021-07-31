const path = require("path");

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  plugins: [
    "unused-imports",
    "workspaces",
    "@emotion",
    "react-hooks",
    "jsx-a11y",
  ],
  extends: [
    "eslint:recommended",
    "plugin:json/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:workspaces/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: path.join(
          __dirname,
          "../../../",
          "packages/**/*",
          "tsconfig.json",
        ),
      },
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-unused-vars": "off",
    "no-empty": "warn",
    "import/no-unresolved": "error",
    "import/order": [
      "warn",
      {
        "newlines-between": "never",
        groups: [
          "builtin",
          "external",
          "internal",
          "object",
          "parent",
          "sibling",
          "index",
        ],
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": "off",
    "@typescript-eslint/explicit-member-accessibility": ["warn"],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "@emotion/jsx-import": "off",
    "@emotion/no-vanilla": "error",
    "@emotion/import-from-emotion": "error",
    "@emotion/styled-import": "error",
  },
  overrides: [
    {
      files: ["*.{js,jsx}"],
      rules: {
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["**/__tests__/*.{spec,test}.{js,jsx,ts,tsx}"],
      env: {
        jest: true,
      },
      extends: ["plugin:jest/recommended"],
    },
  ],
};

module.exports = config;
