import baseConfig from '@kitiumai/config/eslint.config.base.js';

export default [
  ...baseConfig,
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
  // Add your custom rules here
];
