# storybook-framework-hono-vite

Monorepo for the `storybook-framework-hono-vite` package and its examples.

## Workspace Layout

- `packages/storybook-framework-hono-vite`: published Storybook framework package
- `examples/basic`: minimal HonoX app wired to this framework, with stories for its UI primitives and one interactive island

## Commands

```sh
pnpm build              # build the framework package
pnpm typecheck          # tsc --noEmit across the workspace
pnpm check              # vp check (format + lint)
pnpm test               # framework unit tests + example Storybook browser tests
pnpm storybook          # Storybook dev (under examples/basic)
pnpm build-storybook    # Storybook static build
```
