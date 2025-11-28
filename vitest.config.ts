/**
 * Vitest Configuration for @kitiumai/types
 * Using latest @kitiumai/vitest-helpers 2.0 APIs
 */
import { defineConfig } from 'vitest/config';
import { createKitiumVitestConfig } from '@kitiumai/vitest-helpers/config';

export default defineConfig(
  createKitiumVitestConfig({
    preset: 'library',
    projectName: '@kitiumai/types',
    environment: 'node',
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'tests/**/*'],
    },
    overrides: {
      test: {
        // Type tests using tsd
        typecheck: {
          enabled: false, // We use tsd for type testing
        },
        // Include test files
        include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
        exclude: ['tests/**/*.test-d.ts'], // Exclude tsd type tests
      },
    },
  })
);
