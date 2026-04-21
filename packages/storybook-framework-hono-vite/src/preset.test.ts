import { afterEach, describe, expect, it, vi } from 'vitest';

const transformWithEsbuild = vi.fn();

type HonoJsxPlugin = {
  name: string;
  transform: (code: string, id: string) => Promise<unknown>;
};

vi.mock('vite', () => ({
  transformWithEsbuild,
}));

afterEach(() => {
  transformWithEsbuild.mockReset();
  vi.resetModules();
});

describe('viteFinal', () => {
  it('merges the required Hono optimizeDeps entries', async () => {
    const { viteFinal } = await import('./preset.js');
    const applyViteFinal = viteFinal!;

    const config = await applyViteFinal(
      {
        optimizeDeps: {
          include: ['custom-dep', 'hono/jsx/dom'],
        },
        plugins: [{ name: 'existing-plugin' }],
      } as never,
      {} as never,
    );

    expect(config.optimizeDeps?.include).toEqual([
      'custom-dep',
      'hono/jsx/dom',
      'hono/jsx/dom/client',
      'hono/jsx/dom/jsx-runtime',
    ]);
  });

  it('prepends the Hono JSX plugin ahead of existing plugins', async () => {
    const { viteFinal } = await import('./preset.js');
    const applyViteFinal = viteFinal!;

    const config = await applyViteFinal(
      {
        plugins: [{ name: 'existing-plugin' }],
      } as never,
      {} as never,
    );

    const plugin = config.plugins?.[0] as HonoJsxPlugin;

    expect(config.plugins).toHaveLength(2);
    expect(plugin.name).toBe('storybook-framework-hono-vite:hono-jsx');
    expect(config.plugins?.[1]).toEqual({ name: 'existing-plugin' });
  });

  it('transforms local TSX files with the Hono JSX runtime settings', async () => {
    const transformed = { code: 'compiled', map: null };
    transformWithEsbuild.mockResolvedValue(transformed);

    const { viteFinal } = await import('./preset.js');
    const applyViteFinal = viteFinal!;
    const config = await applyViteFinal({} as never, {} as never);
    const plugin = config.plugins?.[0] as HonoJsxPlugin;

    const result = await plugin.transform('const view = <div />;', '/tmp/view.tsx?story');

    expect(result).toBe(transformed);
    expect(transformWithEsbuild).toHaveBeenCalledWith('const view = <div />;', '/tmp/view.tsx', {
      jsx: 'automatic',
      jsxImportSource: 'hono/jsx/dom',
      loader: 'tsx',
      sourcemap: true,
      target: 'esnext',
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react-jsx',
          jsxImportSource: 'hono/jsx/dom',
        },
      },
    });
  });

  it('ignores files from node_modules', async () => {
    const { viteFinal } = await import('./preset.js');
    const applyViteFinal = viteFinal!;
    const config = await applyViteFinal({} as never, {} as never);
    const plugin = config.plugins?.[0] as HonoJsxPlugin;

    await expect(
      plugin.transform('const view = <div />;', '/tmp/node_modules/pkg/view.tsx'),
    ).resolves.toBeNull();
    expect(transformWithEsbuild).not.toHaveBeenCalled();
  });

  it('uses the JSX loader for .jsx sources', async () => {
    const transformed = { code: 'compiled-jsx', map: null };
    transformWithEsbuild.mockResolvedValue(transformed);

    const { viteFinal } = await import('./preset.js');
    const applyViteFinal = viteFinal!;
    const config = await applyViteFinal({} as never, {} as never);
    const plugin = config.plugins?.[0] as HonoJsxPlugin;

    const result = await plugin.transform('const view = <div />;', '/tmp/view.jsx');

    expect(result).toBe(transformed);
    expect(transformWithEsbuild).toHaveBeenCalledTimes(1);
    expect(transformWithEsbuild).toHaveBeenCalledWith('const view = <div />;', '/tmp/view.jsx', {
      jsx: 'automatic',
      jsxImportSource: 'hono/jsx/dom',
      loader: 'jsx',
      sourcemap: true,
      target: 'esnext',
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react-jsx',
          jsxImportSource: 'hono/jsx/dom',
        },
      },
    });
  });
});
