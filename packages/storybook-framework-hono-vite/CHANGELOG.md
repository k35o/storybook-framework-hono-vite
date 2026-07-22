# storybook-framework-hono-vite

## 0.2.2

### Patch Changes

- Switch release automation from changesets/action to pnpm-release-action (pnpm built-in release management). No runtime changes.

## 0.2.1

### Patch Changes

- [#29](https://github.com/k35o/storybook-framework-hono-vite/pull/29) [`ed487e2`](https://github.com/k35o/storybook-framework-hono-vite/commit/ed487e2f9c1516952ac10d80fe7969d3eae6422c) Thanks [@k35o](https://github.com/k35o)! - Add `storybook.displayName` metadata to package.json so the package shows a friendly name ("Hono (Vite)") in the Storybook integration catalog.

- [#31](https://github.com/k35o/storybook-framework-hono-vite/pull/31) [`d1f56f7`](https://github.com/k35o/storybook-framework-hono-vite/commit/d1f56f7df445e58471ed3104d12cab9a7bb40117) Thanks [@k35o](https://github.com/k35o)! - Prefer Vite 8's `transformWithOxc` for the Hono JSX transform, falling back to `transformWithEsbuild` on Vite 5/6/7. This removes the `transformWithEsbuild` deprecation warning emitted on every transform under Vite 8 while keeping the existing `vite` peer dependency range (`^5 || ^6 || ^7 || ^8`).

## 0.2.0

### Minor Changes

- [#3](https://github.com/k35o/storybook-framework-hono-vite/pull/3) [`3e6171b`](https://github.com/k35o/storybook-framework-hono-vite/commit/3e6171bf2d1f008fdd2901136e11c64532e5cfef) Thanks [@k35o](https://github.com/k35o)! - Close three ergonomic gaps against `@storybook/react-vite`:

  - Re-export `ArgTypes` from the framework entry, matching react-vite's `public-types.ts`.
  - Apply `AddMocks<TArgs, DefaultArgs>` inside `StoryObj`, so `fn()` passed in meta `args` keeps its mock type (`.mock`, `.mockReturnValue`, …) in story `play` callbacks.
  - Key the runtime `ErrorBoundary` on `storyContext.id` so it resets between stories instead of sticking in the fallback state after a thrown story.

- [#3](https://github.com/k35o/storybook-framework-hono-vite/pull/3) [`4359004`](https://github.com/k35o/storybook-framework-hono-vite/commit/435900435109d806b71000d7f98ca6bd201b8abc) Thanks [@k35o](https://github.com/k35o)! - Narrow `HonoRenderer['storyResult']` to `JSX.Element | null` so decorators can use `<Story />` JSX directly, matching `@storybook/react-vite`. `mount` also accepts the same type. Decorators that returned raw strings, numbers, or arrays (previously allowed via `Child`) must now return JSX.

## 0.1.0

### Minor Changes

- [`00aee32`](https://github.com/k35o/storybook-framework-hono-vite/commit/00aee32505d60a29d300f5321c406524bfa3fc58) Thanks [@k35o](https://github.com/k35o)! - Initial release: Storybook framework for Hono JSX with the Vite builder.
