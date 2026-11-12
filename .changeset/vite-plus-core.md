---
'storybook-framework-hono-vite': none
---

Move the workspace to vite-plus 1.5.0 and Vitest 5.1.0, and resolve `vite` to `@voidzero-dev/vite-plus-core` through the catalog and an override. `vp pack` refuses to run when `vite` resolves to the upstream package, which had been failing every CI job. Dev tooling only: the published `dist` and its `vite` peer range do not change.
