import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    typecheck: {
      enabled: true,
      include: ["**/*.test-d.ts"],
    },
  },
});
