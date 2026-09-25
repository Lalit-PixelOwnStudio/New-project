import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./src/lib/empty-module.ts", import.meta.url)),
    },
  },
  test: { include: ["test/**/*.test.ts"] },
});
