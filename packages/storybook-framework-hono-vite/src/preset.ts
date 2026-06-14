import { fileURLToPath } from 'node:url';
import type { StorybookConfigVite } from '@storybook/builder-vite';
import type { Plugin } from 'vite';
// `transformWithOxc` was only added in Vite 8, so it is imported via the
// namespace: a named `import { transformWithOxc }` would fail to link against
// Vite 5/6/7, whereas a missing namespace member is simply `undefined`.
import * as vite from 'vite';

const HONO_JSX_IMPORT_SOURCE = 'hono/jsx/dom';

const cleanId = (id: string) => id.split('?')[0] ?? id;

const isLocalJsxFile = (id: string) => {
  const normalizedId = cleanId(id);

  return /\.(?:[cm]?[jt]sx)$/.test(normalizedId) && !normalizedId.includes('/node_modules/');
};

// esbuild calls this `loader` and oxc calls it `lang`, but both accept the same
// 'tsx' | 'jsx' values, so a single helper feeds both transformers.
const getLang = (id: string): 'tsx' | 'jsx' => {
  const normalizedId = cleanId(id);

  if (
    normalizedId.endsWith('.tsx') ||
    normalizedId.endsWith('.mtsx') ||
    normalizedId.endsWith('.ctsx')
  ) {
    return 'tsx';
  }

  return 'jsx';
};

// Vite 8 deprecates `transformWithEsbuild` in favour of `transformWithOxc`.
// Prefer oxc when present (Vite 8) to silence the deprecation warning, and fall
// back to esbuild on Vite 5/6/7 where oxc does not exist (and esbuild is not yet
// deprecated). Both return a `{ code, map }` shape the transform hook accepts.
const transformHonoJsx = (code: string, id: string) => {
  const filename = cleanId(id);
  const lang = getLang(id);

  if (typeof vite.transformWithOxc === 'function') {
    return vite.transformWithOxc(code, filename, {
      lang,
      // Force module semantics so oxc emits ESM `import` for the auto JSX
      // runtime even when a file has no other imports/exports (matching what
      // esbuild's automatic runtime produced); otherwise such files would be
      // treated as scripts and get a CommonJS `require`.
      sourceType: 'module',
      jsx: {
        runtime: 'automatic',
        importSource: HONO_JSX_IMPORT_SOURCE,
      },
      sourcemap: true,
      target: 'esnext',
    });
  }

  return vite.transformWithEsbuild(code, filename, {
    jsx: 'automatic',
    jsxImportSource: HONO_JSX_IMPORT_SOURCE,
    loader: lang,
    sourcemap: true,
    target: 'esnext',
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        jsxImportSource: HONO_JSX_IMPORT_SOURCE,
      },
    },
  });
};

const honoJsxPlugin = (): Plugin => {
  return {
    name: 'storybook-framework-hono-vite:hono-jsx',
    enforce: 'pre',
    async transform(code, id) {
      if (!isLocalJsxFile(id)) {
        return null;
      }

      return transformHonoJsx(code, id);
    },
  };
};

const mergeIncludes = (values: string[] = []) =>
  Array.from(
    new Set([...values, 'hono/jsx/dom', 'hono/jsx/dom/client', 'hono/jsx/dom/jsx-runtime']),
  );

export const core = {
  builder: import.meta.resolve('@storybook/builder-vite'),
  renderer: fileURLToPath(new URL('./renderer/preset.mjs', import.meta.url)),
};

export const viteFinal: StorybookConfigVite['viteFinal'] = async (config) => {
  return {
    ...config,
    optimizeDeps: {
      ...config.optimizeDeps,
      include: mergeIncludes(config.optimizeDeps?.include),
    },
    plugins: [honoJsxPlugin(), ...(config.plugins ?? [])],
  };
};
