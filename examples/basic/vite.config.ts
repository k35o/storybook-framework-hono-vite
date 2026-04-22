import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import honox from 'honox/vite';
import { defineConfig } from 'vite-plus';

const isStorybook = process.env.STORYBOOK === 'true';
const isVitest = process.env.VITEST === 'true';
const isAppRuntime = !isStorybook && !isVitest;

export default defineConfig({
  fmt: {
    singleQuote: true,
  },
  staged: {
    '*.{js,ts,cjs,mjs,jsx,tsx,json,jsonc}': 'vp check --fix',
  },
  plugins: isAppRuntime ? [honox()] : [],
  test: isVitest
    ? {
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
      }
    : undefined,
});
