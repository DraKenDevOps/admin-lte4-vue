# AdminLTE 4 + Vue 3 + TypeScript

An AdminLTE 4 single-page application built with Vue 3, Vue Router, and Vite. The shell
(header, sidebar, treeview, theme, search) is implemented in Vue on top of the vendored
AdminLTE 4.10.1 stylesheet — no AdminLTE JavaScript and no duplicated Bootstrap CSS.

See [`integrations/ADMINLTE-VUE-INTEGRATION-PLAN.md`](integrations/ADMINLTE-VUE-INTEGRATION-PLAN.md)
for the design and [`integrations/README.md`](integrations/README.md) for conventions and
implementation status.

## Commands

```bash
pnpm install
pnpm dev          # Vite dev server
pnpm build        # vue-tsc -b && vite build
pnpm preview      # preview the production build
pnpm typecheck    # vue-tsc -b
pnpm test         # Vitest watch mode
pnpm test:run     # Vitest once (CI)
```

## Stack

- Vue 3.5 + `<script setup>` + TypeScript (strict, `erasableSyntaxOnly`)
- Vue Router 5 (lazy routes, typed `RouteMeta`)
- Bootstrap 5.3.8 JS data API (dropdown, collapse, modal, tooltip) with AdminLTE CSS
- Chart.js 4, OverlayScrollbars 2, Bootstrap Icons, Fontsource Source Sans 3
- Vitest 5 + Vue Test Utils + happy-dom
