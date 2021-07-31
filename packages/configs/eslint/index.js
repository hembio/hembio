/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.js"],
      extends: ["eslint:recommended", "prettier"],
      rules: {
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      },
    },
    {
      files: ["*.json"],
      extends: ["plugin:json/recommended"],
    },
    {
      files: ["*.{js,jsx,ts,tsx}"],
      plugins: ["unused-imports", "workspaces"],
      extends: ["plugin:import/recommended"],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
          modules: true,
        },
      },
      settings: {
        react: {
          version: "detect",
        },
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true,
            project: ["packages/**/*/tsconfig.json"],
          },
        },
      },
      rules: {
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
      },
    },
    {
      files: ["*.{ts,tsx}"],
      plugins: ["unused-imports", "workspaces"],
      parser: "@typescript-eslint/parser",
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
      ],
      rules: {
        "@typescript-eslint/explicit-member-accessibility": ["warn"],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_" },
        ],
      },
    },
    {
      files: ["*.{jsx,tsx}"],
      plugins: ["@emotion"],
      extends: ["plugin:react/recommended"],
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/display-name": "off",
        "@emotion/jsx-import": "error",
        "@emotion/no-vanilla": "error",
        "@emotion/import-from-emotion": "error",
        "@emotion/styled-import": "error",
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
