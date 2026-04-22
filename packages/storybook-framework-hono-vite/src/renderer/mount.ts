import type { StoryContext as StoryContextBase } from 'storybook/internal/types';
import type { HonoRenderer, HonoStoryResult } from './index.js';

export const mount = (context: StoryContextBase<HonoRenderer>) => async (ui?: HonoStoryResult) => {
  if (ui !== undefined) {
    context.originalStoryFn = () => ui;
  }

  await context.renderToCanvas();
  return context.canvas;
};
