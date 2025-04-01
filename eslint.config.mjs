import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";


export default defineConfig([
  { ignores: ["dist"] },
  { files: ["**/*.ts"] },
  { files: ["**/*.ts"], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
]);