import type { Child } from 'hono/jsx';
import type { StoryContext as StoryContextBase } from 'storybook/internal/types';
import type { HonoRenderer } from './index.js';

export const mount = (context: StoryContextBase<HonoRenderer>) => async (ui?: Child) => {
  if (ui !== undefined) {
    context.originalStoryFn = () => ui;
  }

  await context.renderToCanvas();
  return context.canvas;
};
