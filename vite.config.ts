import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
