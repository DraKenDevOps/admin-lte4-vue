# AdminLTE 4 + Vue integration

This directory holds the integration plan and the conventions used by the implementation.

- Plan: [`ADMINLTE-VUE-INTEGRATION-PLAN.md`](./ADMINLTE-VUE-INTEGRATION-PLAN.md)
- Vendored asset provenance: [`../src/styles/VENDOR.md`](../src/styles/VENDOR.md)

## Implementation status

| Plan phase | Status | Notes |
|---|---|---|
| 0 — Baseline and decisions | Done | Vendored AdminLTE 4.10.1 CSS; no Pinia; CSS-first approach. |
| 1 — Dependencies, CSS, bootstrapping | Done | Demo files removed; `@` alias; CSS order; pre-paint theme script. |
| 2 — Static app shell | Done | `AdminLayout`, header, sidebar, breadcrumb, footer. |
| 3 — Router, sidebar, theme, search | Done | Lazy routes, route-driven treeview, persistence, header/sidebar filter, skip links. |
| 4 — Dashboard | Done | Small boxes, Chart.js line chart, direct chat, recent orders table. |
| 5 — Reusable widgets | Done | `AppCard` (collapse/maximize/remove), `SmallBox`, `InfoBox`, `AppModal`, `LineChart`. |
| 6 — Page migration waves | Not started | Only dashboard, starter, widgets, login, and 404 ship. Migrate one wave per PR. |
| 7 — Optional parity (RTL, SCSS, hybrid JS) | Not started | LTR only; no AdminLTE JS. |
| 8 — Hardening and CI | Partial | Typecheck, 21 unit/component tests, build, and GitHub Actions CI. Playwright/axe not set up. |

Deviations from the plan worth knowing:

- `SmallBox` renders its value in `<h2 class="h3">` and `AppCard` uses `<h2 class="card-title">`
  (instead of `h3`) so heading order stays valid under the page `<h1>`. AdminLTE styles both
  via classes, so the visuals are unchanged. This fixed Lighthouse's `heading-order` failure.
- The header search is wired to the sidebar filter rather than a search-results page.
- The vendored stylesheet is byte-identical to AdminLTE 4.10.1 except for the removed
  `sourceMappingURL` comment (the `.map` file is not shipped).
- Route changes swap the view immediately, like AdminLTE's multi-page navigation; the
  earlier custom 0.15 s page fade was removed.
- Login is a demo form that navigates to the dashboard; there is no auth layer yet.

## Conventions

### CSS and JavaScript ownership

- **AdminLTE CSS only.** Never import `bootstrap/dist/css/bootstrap.css` — AdminLTE bundles
  Bootstrap 5.3.8.
- **Bootstrap JS is limited to the data API** imported in `src/main.ts` (dropdown, collapse,
  modal, tooltip). Programmatic use is allowed through `AppModal`
  (`bootstrap/js/dist/modal`).
- **No AdminLTE JS.** Sidebar, treeview, theme, search, card widgets, and fullscreen are
  Vue-owned. One owner per feature; do not add the hybrid path unless a behaviour truly
  cannot be reimplemented.
- Import order in `src/main.ts`: fonts/icons → OverlayScrollbars CSS → AdminLTE → project
  overrides. Keep it.

### Adding a page

1. Add a view in `src/views/` with a single root element.
2. Register a lazy route in `src/router/index.ts` with `meta.title`, `meta.layout`, and
   `meta.breadcrumb`.
3. Add an entry to `src/data/navigation.ts` using `NavItem` (`to`, `icon`, `badge`,
   `children`). Only link pages that ship.
4. Keep the page body inside `.app-content` (the layout supplies header, sidebar, and footer).
   Replace `href` with `RouterLink`, inline scripts with composables, and demo data with typed
   fixtures in `src/data/`.
5. Check the four breakpoints (1440/1024/768/375) and both themes.

### Theme

- `src/composables/useTheme.ts` is a module-level singleton.
- Storage key `appTheme` with values `light | dark | auto`; applies `data-bs-theme` and
  `color-scheme` to `<html>`.
- The inline script in `index.html` applies the theme before first paint. Keep it inline
  (or give it a CSP nonce/hash if you add a strict policy).
- The sidebar is intentionally `data-bs-theme="dark"` even in light mode, matching AdminLTE.

### Sidebar

- The shell body uses `layout-fixed fixed-header sidebar-expand-lg sidebar-mini`, combining
  AdminLTE's `fixed-header` and `collapsed-sidebar` examples. The mini sidebar starts
  collapsed (icons only, expanding on hover) and users can still expand it from the header.
- `useSidebar` owns body classes (`sidebar-collapse`, `sidebar-open`), the `991.98px`
  breakpoint, persistence (`appSidebarState` stores the class name), `Escape`, resize, and
  focus restore. `index.html` restores the collapsed class before paint unless the stored
  value is `sidebar-open`.
- Like AdminLTE, `useSidebar` adds `app-loaded` to `<body>` 400 ms after mount. AdminLTE's CSS
  disables shell transitions until that class exists, so the sidebar width animates (300 ms)
  only after the first paint. Resizes add `hold-transition` for 200 ms to suppress jank.
- Treeview open state is derived from the route; a click overrides it until the next
  navigation. Parent toggles are real `<button>` elements with `aria-expanded`. The
  `.nav-treeview` slides with AdminLTE's 300 ms height animation.
- `useNavSearch` shares the filter query between the header and sidebar search fields.

### Widgets

- `AppCard` binds AdminLTE classes (`collapsed-card`, `collapsing-card`, `expanding-card`,
  `maximized-card`, `was-collapsed`) and emits `removed`. Do not import AdminLTE's `CardWidget`.
  Collapse/expand and removal use the 500 ms slide; maximize/minimize use the 150 ms sequence
  and the global `html.maximized-card` class.
- `src/lib/slide.ts` is a direct port of AdminLTE's `slideUp`/`slideDown` helpers (inline
  height/margin/padding transition, timer cancellation, cleanup) and honours
  `prefers-reduced-motion`.
- `LineChart` applies the AdminLTE chart theme from CSS variables and redraws when the
  resolved theme changes.

### Tests

- Vitest + happy-dom; setup in `src/test/setup.ts`.
- Unit tests cover navigation filtering, theme, and sidebar state; component tests cover
  `AppCard` and the recursive sidebar menu.
- Use `__resetSidebarStateForTests()` when a test needs a clean sidebar singleton.

## Verification

```bash
pnpm typecheck
pnpm test:run
pnpm build
```

Manual smoke matrix: see §8 of the plan. Current Lighthouse result on the dashboard:
accessibility 100, best practices 100, SEO 100.
