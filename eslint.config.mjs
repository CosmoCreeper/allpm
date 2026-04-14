import json from "@eslint/json";
import tseslint from "typescript-eslint";
import globals from "globals";
import markdown from "@eslint/markdown";

export default tseslint.config(
  tseslint.configs.recommendedTypeChecked,
  {
    files: ["src/**/*.ts", "types/**/*.d.ts", "scripts/**/*.ts", "tests/**/*.test.ts"],
    rules: {
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["*.json"],
    extends: [tseslint.configs.disableTypeChecked],
    language: "json/json",
    ...json.configs.recommended,
  },
  {
    files: ["*.jsonc", "tsconfig.json"],
    extends: [tseslint.configs.disableTypeChecked],
    language: "json/jsonc",
    ...json.configs.recommended,
  },
  {
    files: ["*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
  },
  {
    files: ["**/*.md"],
    extends: [tseslint.configs.disableTypeChecked],
    plugins: { markdown },
    language: "markdown/commonmark",
    rules: {
      "markdown/no-html": "warn",
      "markdown/fenced-code-language": "error",
    },
  },
  {
    ignores: ["dist/", "node_modules/"],
  }
);
