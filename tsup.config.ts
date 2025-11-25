import { defineConfig } from 'tsup';

const entryPoints = [
  'src/index.ts',
  'src/auth.ts',
  'src/auth/access.ts',
  'src/user.ts',
  'src/organization.ts',
  'src/product.ts',
  'src/billing.ts',
  'src/billing/pricing.ts',
  'src/api.ts',
  'src/api/contracts.ts',
  'src/errors.ts',
  'src/utils.ts',
  'src/primitives.ts',
  'src/validators.ts',
  'src/entities.ts',
];

export default defineConfig({
  entry: entryPoints,
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  target: 'es2020',
  splitting: false,
  outDir: 'dist',
  minify: false,
  skipNodeModulesBundle: true,
  keepNames: true,
  outExtension({ format }) {
    return format === 'cjs' ? { js: '.cjs' } : { js: '.js' };
  },
});
