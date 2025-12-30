const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const prettierPlugin = require("eslint-plugin-prettier");
const eslintConfigPrettier = require("eslint-config-prettier");

const prettierConfig = require("@repo/prettier-config");

module.exports = [
  eslintConfigPrettier,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["dist/**"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },

    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      prettier: prettierPlugin
    },

    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      "prettier/prettier": ["error", prettierConfig],
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/ban-ts-comment": "off"
    },

    settings: {
      react: { version: "detect" }
    }
  }
];
