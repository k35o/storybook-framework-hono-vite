import { afterEach, describe, expect, it, vi } from 'vitest';

type HonoJsxPlugin = {
  name: string;
  transform: (code: string, id: string) => Promise<unknown>;
};

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

const importPreset = async (viteMock: Record<string, unknown>) => {
  vi.doMock('vite', () => viteMock);

  const { viteFinal } = await import('./preset.js');
  const applyViteFinal = viteFinal!;
  const config = await applyViteFinal({} as never, {} as never);
  const plugin = config.plugins?.[0] as HonoJsxPlugin;

  return { applyViteFinal, plugin };
};

describe('viteFinal', () => {
  it('merges the required Hono optimizeDeps entries', async () => {
    const { applyViteFinal } = await importPreset({
      transformWithEsbuild: vi.fn(),
      transformWithOxc: vi.fn(),
    });

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
    const { applyViteFinal } = await importPreset({
      transformWithEsbuild: vi.fn(),
      transformWithOxc: vi.fn(),
    });

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
});

describe('honoJsxPlugin transform', () => {
  it('prefers transformWithOxc with the Hono JSX runtime settings on Vite 8', async () => {
    const transformed = { code: 'compiled', map: null };
    const transformWithOxc = vi.fn().mockResolvedValue(transformed);
    const transformWithEsbuild = vi.fn();

    const { plugin } = await importPreset({ transformWithEsbuild, transformWithOxc });

    const result = await plugin.transform('const view = <div />;', '/tmp/view.tsx?story');

    expect(result).toBe(transformed);
    expect(transformWithEsbuild).not.toHaveBeenCalled();
    expect(transformWithOxc).toHaveBeenCalledWith('const view = <div />;', '/tmp/view.tsx', {
      lang: 'tsx',
      sourceType: 'module',
      jsx: {
        runtime: 'automatic',
        importSource: 'hono/jsx/dom',
      },
      sourcemap: true,
      target: 'esnext',
    });
  });

  it('falls back to transformWithEsbuild when transformWithOxc is unavailable (Vite 5/6/7)', async () => {
    const transformed = { code: 'compiled', map: null };
    const transformWithEsbuild = vi.fn().mockResolvedValue(transformed);

    // Vite 5/6/7 do not export `transformWithOxc`; on a real ESM namespace the
    // missing member reads as `undefined`, which is what `undefined` models here.
    const { plugin } = await importPreset({ transformWithEsbuild, transformWithOxc: undefined });

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

  it('uses the jsx lang for .jsx sources', async () => {
    const transformed = { code: 'compiled-jsx', map: null };
    const transformWithOxc = vi.fn().mockResolvedValue(transformed);
    const transformWithEsbuild = vi.fn();

    const { plugin } = await importPreset({ transformWithEsbuild, transformWithOxc });

    const result = await plugin.transform('const view = <div />;', '/tmp/view.jsx');

    expect(result).toBe(transformed);
    expect(transformWithOxc).toHaveBeenCalledTimes(1);
    expect(transformWithOxc).toHaveBeenCalledWith('const view = <div />;', '/tmp/view.jsx', {
      lang: 'jsx',
      sourceType: 'module',
      jsx: {
        runtime: 'automatic',
        importSource: 'hono/jsx/dom',
      },
      sourcemap: true,
      target: 'esnext',
    });
  });

  it('ignores files from node_modules', async () => {
    const transformWithOxc = vi.fn();
    const transformWithEsbuild = vi.fn();

    const { plugin } = await importPreset({ transformWithEsbuild, transformWithOxc });

    await expect(
      plugin.transform('const view = <div />;', '/tmp/node_modules/pkg/view.tsx'),
    ).resolves.toBeNull();
    expect(transformWithOxc).not.toHaveBeenCalled();
    expect(transformWithEsbuild).not.toHaveBeenCalled();
  });
});
