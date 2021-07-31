/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.json"],
      extends: ["plugin:json/recommended"],
    },
    {
      files: ["*.{js,jsx}"],
      plugins: ["unused-imports", "workspaces"],
      extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
      settings: {
        react: {
          version: "detect",
        },
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
          modules: true,
        },
      },
      rules: {
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
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
      files: ["*.{ts,tsx}"],
      plugins: ["unused-imports", "workspaces", "@emotion"],
      parser: "@typescript-eslint/parser",
      extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
      ],
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
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/display-name": "off",
        "@emotion/jsx-import": "error",
        "@emotion/no-vanilla": "error",
        "@emotion/import-from-emotion": "error",
        "@emotion/styled-import": "error",
        "@typescript-eslint/explicit-member-accessibility": ["warn"],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_" },
        ],
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
