import type { Child, JSXNode } from 'hono/jsx';
import { ErrorBoundary, createElement } from 'hono/jsx/dom';
import { createRoot, type Root } from 'hono/jsx/dom/client';
import type { RenderToCanvas } from 'storybook/internal/types';
import type { HonoParameters, HonoRenderer } from './index.js';

const roots = new WeakMap<HTMLElement, Root>();

const toError = (error: unknown) => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Unknown Hono render error');
};

const getRoot = (
  canvasElement: HTMLElement,
  forceRemount: boolean,
  parameters?: HonoParameters['hono'],
) => {
  if (forceRemount) {
    roots.get(canvasElement)?.unmount();
    roots.delete(canvasElement);
  }

  let root = roots.get(canvasElement);

  if (!root) {
    root = createRoot(canvasElement, parameters?.rootOptions);
    roots.set(canvasElement, root);
  }

  return root;
};

export const renderToCanvas: RenderToCanvas<HonoRenderer> = async (
  { forceRemount, showException, showMain, storyContext, unboundStoryFn },
  canvasElement,
) => {
  const root = getRoot(canvasElement, forceRemount, storyContext.parameters.hono);

  try {
    const storyResult = unboundStoryFn(storyContext) as Child;

    root.render(
      createElement(
        ErrorBoundary as unknown as (props: Record<string, unknown>) => JSXNode,
        {
          key: storyContext.id,
          fallback: null,
          onError: (error: unknown) => {
            showException(toError(error));
          },
        },
        storyResult,
      ),
    );

    showMain();
  } catch (error) {
    showException(toError(error));
    throw error;
  }

  return async () => {
    roots.get(canvasElement)?.unmount();
    roots.delete(canvasElement);
  };
};
