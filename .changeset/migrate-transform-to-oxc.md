---
"storybook-framework-hono-vite": patch
---

Prefer Vite 8's `transformWithOxc` for the Hono JSX transform, falling back to `transformWithEsbuild` on Vite 5/6/7. This removes the `transformWithEsbuild` deprecation warning emitted on every transform under Vite 8 while keeping the existing `vite` peer dependency range (`^5 || ^6 || ^7 || ^8`).
