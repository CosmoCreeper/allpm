import js from "@eslint/js";
import json from "@eslint/json";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["src/**/*.{js,mjs,cjs}"],
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-restricted-globals": ["error", "window", "document"],
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["package.json"],
    language: "json/json",
    ...json.configs.recommended,
  },
  {
    ignores: ["node_modules/"],
  },
];
