import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "out/**",
    "out-soundmetergo/**",
    "node_modules/**",
    "coverage/**",
    "artifacts/**",
    "next-env.d.ts",
    "design/**",
    "public/vendor/lamejs/**",
  ]),
]);
