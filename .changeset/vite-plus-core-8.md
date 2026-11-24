---
'storybook-framework-hono-vite': none
---

Align the catalog's `vite` alias with `@voidzero-dev/vite-plus-core@8.3.8000`, the core vite-plus 1.7.0 depends on. `vp pack` refuses to run when the two differ, which had been failing every CI job and the release. Dev tooling only: the published `dist` and its `vite` peer range do not change.
