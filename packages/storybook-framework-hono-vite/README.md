# storybook-framework-hono-vite

`storybook-framework-hono-vite` is a Storybook framework package for rendering Hono JSX components with the Vite builder.

## Status

This package focuses on the core Storybook canvas flow:

- Hono JSX stories rendered with `hono/jsx/dom/client`
- Vite builder preset for local `.jsx` / `.tsx` files
- CSF `Meta` / `StoryObj` typing for Hono function components
- Portable stories helpers via `composeStory` / `composeStories`

The initial version does not try to replicate the React-specific docs renderer stack from `@storybook/react`.

## Install

```sh
pnpm add -D storybook-framework-hono-vite storybook vite hono
```

## Configure Storybook

`.storybook/main.ts`

```ts
import type { StorybookConfig } from 'storybook-framework-hono-vite';

const config: StorybookConfig = {
  framework: {
    name: 'storybook-framework-hono-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
};

export default config;
```

To make TypeScript understand Hono JSX, set `jsxImportSource` in your app `tsconfig.json`.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx/dom"
  }
}
```

## Example

`src/Button.tsx`

```tsx
export interface ButtonProps {
  label: string;
}

export const Button = ({ label }: ButtonProps) => {
  return <button type="button">{label}</button>;
};
```

`src/Button.stories.tsx`

```tsx
import type { Meta, StoryObj } from 'storybook-framework-hono-vite';
import { Button } from './Button';

const meta = {
  component: Button,
  args: {
    label: 'Hello Hono',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
```

## Notes

- Story files and local source files are transformed to use `hono/jsx/dom`.
- Storybook manager UI and addon UI stay on Storybook's own runtime.
- If you rely on React-only docs behavior, you will need extra renderer work on top of this package.
