# example-basic

A minimal [HonoX](https://github.com/honojs/honox) app wired to
`storybook-framework-hono-vite`.

## Layout

```
app/
  server.ts           # HonoX server entry (createApp)
  client.ts           # client hydration entry (createClient)
  global.d.ts         # ContextRenderer typing
  routes/
    _renderer.tsx     # HTML shell (jsx-renderer + HasIslands)
    index.tsx         # SSR page
  islands/
    todo-list.tsx     # interactive island (useState)
  components/         # shared server + story components
  lib/                # sample data and theme tokens
```

Stories live next to their components (`app/components/*.stories.tsx`,
`app/islands/*.stories.tsx`) and are picked up by Storybook via the
`../app/**/*.stories.@(ts|tsx)` glob in `.storybook/main.ts`.

## Run the Hono app

```bash
pnpm dev
```

HonoX serves the SSR page and hydrates `app/islands/*.tsx` on the client.

## Run Storybook

```bash
pnpm storybook          # dev
pnpm build-storybook    # static build
pnpm test               # vitest + Storybook browser tests (a11y checks included)
```
