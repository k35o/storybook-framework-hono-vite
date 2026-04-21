import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
  },
  staged: {
    '*.{js,ts,cjs,mjs,jsx,tsx,json,jsonc}': 'vp check --fix',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  pack: {
    dts: true,
    entry: ['src/**/*.{ts,tsx}', '!src/**/*.stories.tsx', '!src/**/*.test.{ts,tsx}'],
    format: 'esm',
    outDir: 'dist',
    unbundle: true,
  },
});
