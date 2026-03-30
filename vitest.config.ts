import * as path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.spec.ts", "**/*.test.ts"],
    exclude: ["**/*.e2e-spec.ts", "e2e/**", "playwright-report/**"],
  },
  resolve: {
    alias: {
      "~/tests": path.resolve(__dirname, "./tests"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
