import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'hono/jsx/dom',
  },
  fmt: {
    singleQuote: true,
  },
  staged: {
    '*.{js,ts,cjs,mjs,jsx,tsx,json,jsonc}': 'vp check --fix',
  },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: fileURLToPath(new URL('./.storybook', import.meta.url)),
            storybookScript: 'pnpm storybook --ci',
          }),
        ],
        test: {
          name: { label: 'storybook', color: 'magenta' },
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            screenshotFailures: false,
            instances: [
              {
                browser: 'chromium',
                context: {
                  reducedMotion: 'reduce',
                },
              },
            ],
          },
        },
      },
    ],
  },
});
