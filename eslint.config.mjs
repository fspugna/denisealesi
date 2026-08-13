import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "next-env.d.ts",
    // Raw legacy sources and generated migration artifacts are input data,
    // not application code maintained by this project.
    "migration/source/**",
    "migration/extracted/**",
    "migration/transformed/**",
    "migration/reports/**",
    "migration/backups/**",
  ]),
]);

export default eslintConfig;
