import { enhanceArgTypes } from 'storybook/internal/docs-tools';
import { mount } from './mount.js';
import { render } from './render.js';
import { renderToCanvas } from './render-to-canvas.js';

export const argTypesEnhancers = [enhanceArgTypes];

export const parameters = {
  renderer: 'hono',
};

export { mount, render, renderToCanvas };
