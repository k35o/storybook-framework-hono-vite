import type { StorybookConfig } from 'storybook-framework-hono-vite';

export default {
  addons: ['@storybook/addon-vitest', '@storybook/addon-a11y'],
  framework: {
    name: 'storybook-framework-hono-vite',
    options: {},
  },
  stories: ['../app/**/*.stories.@(ts|tsx)'],
} satisfies StorybookConfig;
