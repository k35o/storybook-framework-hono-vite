---
'storybook-framework-hono-vite': minor
---

Narrow `HonoRenderer['storyResult']` to `JSX.Element | null` so decorators can use `<Story />` JSX directly, matching `@storybook/react-vite`. `mount` also accepts the same type. Decorators that returned raw strings, numbers, or arrays (previously allowed via `Child`) must now return JSX.
