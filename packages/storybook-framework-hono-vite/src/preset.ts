import { fileURLToPath } from 'node:url';
import type { StorybookConfigVite } from '@storybook/builder-vite';
import type { Plugin } from 'vite';
import { transformWithEsbuild } from 'vite';

const HONO_JSX_IMPORT_SOURCE = 'hono/jsx/dom';

const cleanId = (id: string) => id.split('?')[0] ?? id;

const isLocalJsxFile = (id: string) => {
  const normalizedId = cleanId(id);

  return /\.(?:[cm]?[jt]sx)$/.test(normalizedId) && !normalizedId.includes('/node_modules/');
};

const getLoader = (id: string) => {
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

const honoJsxPlugin = (): Plugin => {
  return {
    name: 'storybook-framework-hono-vite:hono-jsx',
    enforce: 'pre',
    async transform(code, id) {
      if (!isLocalJsxFile(id)) {
        return null;
      }

      return transformWithEsbuild(code, cleanId(id), {
        jsx: 'automatic',
        jsxImportSource: HONO_JSX_IMPORT_SOURCE,
        loader: getLoader(id),
        sourcemap: true,
        target: 'esnext',
        tsconfigRaw: {
          compilerOptions: {
            jsx: 'react-jsx',
            jsxImportSource: HONO_JSX_IMPORT_SOURCE,
          },
        },
      });
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
