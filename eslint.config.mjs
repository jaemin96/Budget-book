import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import * as globals from "globals";
import tseslint from "typescript-eslint";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  eslintPluginPrettierRecommended,
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
    rules: {
      quotes: "off",
      // "prettier/prettier": [
      //   "warn",
      //   {
      //     printWidth: 120,
      //     bracketSameLine: false,
      //   },
      // ],
      "prettier/prettier": "off", // prettier lint 끄기
    },
  },

  // Server (bbserver) 설정
  {
    files: ["packages/bbserver/**/*.{ts,js}"],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.resolve(__dirname, "packages", "bbserver"),
        project: [path.resolve(__dirname, "/tsconfig.json")],
      },
      sourceType: "commonjs",
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    settings: {
      prettier: {
        configPath: path.resolve(__dirname, "prettier.config.mjs"),
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },

  // Client (bbclient) 설정
  {
    files: ["packages/bbclient/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [path.resolve(__dirname, "packages/bbclient/tsconfig.json")],
        tsconfigRootDir: path.resolve(__dirname, "packages", "bbclient"),
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      next: {
        rootDir: path.resolve(__dirname, "packages", "bbclient"),
      },
      prettier: {
        configPath: path.resolve(__dirname, "/prettier.config.mjs"),
      },
    },
    // eslint-disable-next-line prettier/prettier
  }
);
