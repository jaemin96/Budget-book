import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import * as globals from "globals";
import tseslint from "typescript-eslint";
import path from "path";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  {
    extends: ["prettier"],
  },

  // Server (bbserver) 설정
  {
    files: ["packages/bbserver/**/*.{ts,js}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.resolve("packages/bbserver"), // <-- 고쳤음
        project: ["./tsconfig.json"], // <-- 추가
      },
      sourceType: "commonjs",
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
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
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.resolve("packages/bbclient"),
        project: ["./tsconfig.json"], // <-- 추가
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin, // <-- 일관성 위해 추가 (선택)
    },
    settings: {
      next: {
        rootDir: path.resolve("packages/bbclient"),
      },
    },
  },

  eslintPluginPrettierRecommended
);
