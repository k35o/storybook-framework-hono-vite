import { afterEach, describe, expect, it, vi } from 'vitest';

const createElement = vi.fn((type, props, ...children) => ({ type, props, children }));
const createRoot = vi.fn();
const ErrorBoundary = Symbol('ErrorBoundary');

vi.mock('hono/jsx/dom', () => ({
  ErrorBoundary,
  createElement,
}));

vi.mock('hono/jsx/dom/client', () => ({
  createRoot,
}));

afterEach(() => {
  createElement.mockClear();
  createRoot.mockReset();
  vi.resetModules();
});

const createRootHandle = () => ({
  render: vi.fn(),
  unmount: vi.fn(),
});

describe('renderToCanvas', () => {
  it('reuses the existing root when forceRemount is false', async () => {
    const firstRoot = createRootHandle();
    createRoot.mockReturnValue(firstRoot);

    const { renderToCanvas } = await import('./render-to-canvas.js');
    const canvasElement = {} as HTMLElement;
    const showException = vi.fn();
    const showMain = vi.fn();
    const storyContext = {
      parameters: {
        hono: {
          rootOptions: { identifierPrefix: 'story' },
        },
      },
    };

    await renderToCanvas(
      {
        forceRemount: false,
        showException,
        showMain,
        storyContext,
        unboundStoryFn: () => 'first-story',
      } as never,
      canvasElement,
    );

    await renderToCanvas(
      {
        forceRemount: false,
        showException,
        showMain,
        storyContext,
        unboundStoryFn: () => 'second-story',
      } as never,
      canvasElement,
    );

    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(firstRoot.render).toHaveBeenCalledTimes(2);
    expect(showMain).toHaveBeenCalledTimes(2);
    expect(showException).not.toHaveBeenCalled();
  });

  it('creates a new root after forceRemount unmounts the previous one', async () => {
    const firstRoot = createRootHandle();
    const secondRoot = createRootHandle();
    createRoot.mockReturnValueOnce(firstRoot).mockReturnValueOnce(secondRoot);

    const { renderToCanvas } = await import('./render-to-canvas.js');
    const canvasElement = {} as HTMLElement;
    const storyContext = {
      parameters: {
        hono: {
          rootOptions: { identifierPrefix: 'story' },
        },
      },
    };

    await renderToCanvas(
      {
        forceRemount: false,
        showException: vi.fn(),
        showMain: vi.fn(),
        storyContext,
        unboundStoryFn: () => 'first-story',
      } as never,
      canvasElement,
    );

    await renderToCanvas(
      {
        forceRemount: true,
        showException: vi.fn(),
        showMain: vi.fn(),
        storyContext,
        unboundStoryFn: () => 'third-story',
      } as never,
      canvasElement,
    );

    expect(createRoot).toHaveBeenCalledTimes(2);
    expect(createRoot).toHaveBeenNthCalledWith(1, canvasElement, { identifierPrefix: 'story' });
    expect(createRoot).toHaveBeenNthCalledWith(2, canvasElement, { identifierPrefix: 'story' });
    expect(firstRoot.unmount).toHaveBeenCalledTimes(1);
    expect(secondRoot.render).toHaveBeenCalledTimes(1);
  });

  it('reports rendering failures and rethrows the original error', async () => {
    const root = createRootHandle();
    createRoot.mockReturnValue(root);

    const { renderToCanvas } = await import('./render-to-canvas.js');
    const canvasElement = {} as HTMLElement;
    const error = new Error('story failed');
    const showException = vi.fn();

    await expect(
      renderToCanvas(
        {
          forceRemount: false,
          showException,
          showMain: vi.fn(),
          storyContext: { parameters: {} },
          unboundStoryFn: () => {
            throw error;
          },
        } as never,
        canvasElement,
      ),
    ).rejects.toBe(error);

    expect(showException).toHaveBeenCalledWith(error);
    expect(root.render).not.toHaveBeenCalled();
  });

  it('forwards ErrorBoundary errors through showException', async () => {
    const root = createRootHandle();
    createRoot.mockReturnValue(root);

    const { renderToCanvas } = await import('./render-to-canvas.js');
    const canvasElement = {} as HTMLElement;
    const showException = vi.fn();

    const cleanup = (await renderToCanvas(
      {
        forceRemount: false,
        showException,
        showMain: vi.fn(),
        storyContext: { parameters: {} },
        unboundStoryFn: () => 'story',
      } as never,
      canvasElement,
    )) as () => Promise<void>;

    const renderedTree = root.render.mock.calls[0]?.[0] as {
      props: { onError: (error: unknown) => void };
    };

    renderedTree.props.onError('boundary failed');

    expect(showException).toHaveBeenCalledWith(new Error('boundary failed'));
    await cleanup();
  });

  it('keys the ErrorBoundary on storyContext.id so it resets between stories', async () => {
    const root = createRootHandle();
    createRoot.mockReturnValue(root);

    const { renderToCanvas } = await import('./render-to-canvas.js');

    await renderToCanvas(
      {
        forceRemount: false,
        showException: vi.fn(),
        showMain: vi.fn(),
        storyContext: { id: 'story--one', parameters: {} },
        unboundStoryFn: () => 'story',
      } as never,
      {} as HTMLElement,
    );

    const [, props] = createElement.mock.calls.at(-1) ?? [];
    expect(props).toMatchObject({ key: 'story--one' });
  });

  it('unmounts the root during cleanup', async () => {
    const root = createRootHandle();
    createRoot.mockReturnValue(root);

    const { renderToCanvas } = await import('./render-to-canvas.js');
    const cleanup = (await renderToCanvas(
      {
        forceRemount: false,
        showException: vi.fn(),
        showMain: vi.fn(),
        storyContext: { parameters: {} },
        unboundStoryFn: () => 'story',
      } as never,
      {} as HTMLElement,
    )) as () => Promise<void>;

    await cleanup();

    expect(root.unmount).toHaveBeenCalledTimes(1);
  });
});
