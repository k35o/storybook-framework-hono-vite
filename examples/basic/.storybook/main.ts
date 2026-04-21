import { defineMain } from 'storybook-framework-hono-vite/node';

export default defineMain({
  addons: ['@storybook/addon-vitest'],
  framework: {
    name: 'storybook-framework-hono-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(ts|tsx)'],
});
