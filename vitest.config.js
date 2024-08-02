import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    mockReset: true,
    include: ['test/*.test.js'],
    coverage: {
      exclude: ['node_modules', 'dist', '.git', 'lib', 'coverage'],
      include: ['src/**'],
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    }
  },
});
