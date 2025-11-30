/**
 * ESLint configuration for @kitiumai/types
 * Using the latest @kitiumai/lint 2.0 and @kitiumai/config 2.0 APIs
 */
import baseConfig from '@kitiumai/config/eslint.config.base.js';
import { createKitiumConfig } from '@kitiumai/lint';

export default createKitiumConfig({
  baseConfig: baseConfig,
  ignorePatterns: ['dist/**', '**/*.d.ts', '**/*.d.cts'],
  additionalRules: {
    // Types package specific rules
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': 'off', // Types don't have runtime console usage
  },
  overrides: [
    // Allow parent imports for re-export files in subdirectories
    {
      files: ['src/**/contracts.ts', 'src/**/errors.ts', 'src/**/access.ts', 'src/**/pricing.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    // Allow PascalCase for exported schema constants (they're public API)
    {
      files: ['src/validators.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            filter: {
              regex: 'Schema$',
              match: true,
            },
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
        ],
      },
    },
  ],
});
