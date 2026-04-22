---
'storybook-framework-hono-vite': minor
---

Close three ergonomic gaps against `@storybook/react-vite`:

- Re-export `ArgTypes` from the framework entry, matching react-vite's `public-types.ts`.
- Apply `AddMocks<TArgs, DefaultArgs>` inside `StoryObj`, so `fn()` passed in meta `args` keeps its mock type (`.mock`, `.mockReturnValue`, …) in story `play` callbacks.
- Key the runtime `ErrorBoundary` on `storyContext.id` so it resets between stories instead of sticking in the fallback state after a thrown story.
