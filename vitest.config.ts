import * as path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ...
  },
  resolve: {
    alias: {
      "~/tests": path.resolve(__dirname, "./tests"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
