import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwindcss from "eslint-plugin-tailwindcss";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  {
    ignores: ["dist", "src/styles/**/*.css"],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      tailwindcss: tailwindcss,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-require-imports": "warn",
      "tailwindcss/classnames-order": "warn",
      "react-refresh/only-export-components": ["off"],
    },
  },
  {
    files: ["**/*.css"],
    rules: {},
  },
]);
