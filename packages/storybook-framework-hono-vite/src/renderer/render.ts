import type { JSXNode } from 'hono/jsx';
import { createElement } from 'hono/jsx/dom';
import type { ArgsStoryFn } from 'storybook/internal/types';
import type { HonoRenderer, HonoStoryResult } from './index.js';

export const render: ArgsStoryFn<HonoRenderer> = (args, context) => {
  const { component: Component, id } = context;

  if (!Component) {
    throw new Error(
      `Unable to render story ${id} because the component annotation is missing from the default export.`,
    );
  }

  return createElement(
    Component as unknown as (props: Record<string, unknown>) => JSXNode,
    args as Record<string, unknown>,
  ) as unknown as HonoStoryResult;
};
