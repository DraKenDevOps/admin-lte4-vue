# AdminLTE 4 + Vue 3 + TypeScript Integration Plan

| | |
|---|---|
| **Target project** | `C:\Users\Anakin\Other\admin-lte4-vue` |
| **AdminLTE source** | `C:\Users\Anakin\Other\admin-lte-4` (dist **4.10.1**) |
| **Current stack** | Vue **3.5.44**, Vite **8.3.4**, TypeScript **6.0.3**, vue-tsc **3.3.13**, pnpm **12.15.0**, Node **24.22.1** |
| **Plan date** | 2026-10-28 |
| **Status** | **Planned — not implemented** |
| **Deliverable** | This document in `integrations/` |

---

## 1. Goal

Turn the existing Vite + Vue 3 + TypeScript scaffold into a production-ready **AdminLTE 4 single-page application** that:

- Preserves AdminLTE 4's visual design, layout grid, dark mode, and accessibility behaviour.
- Uses Vue Router for navigation instead of 91 duplicated HTML documents.
- Owns interactive shell behaviour in typed Vue composables/components.
- Avoids the DOM-lifecycle conflicts between AdminLTE's vanilla JS plugins and Vue's renderer.
- Keeps the project buildable with `pnpm build` (`vue-tsc -b && vite build`) and testable in CI.

### Non-goals (initially)

- Porting all 91 AdminLTE demo pages in the first iteration.
- Building a reusable AdminLTE component library for other projects.
- Server-side rendering (the scaffold is a client-only SPA).
- Keeping jQuery or any AdminLTE page-level inline scripts.

---

## 2. Current-state audit

| Item | Finding |
|---|---|
| Scaffold | Fresh Vite Vue-TS app: `App.vue`, `HelloWorld.vue`, `style.css` |
| Router | Not installed |
| State | No Pinia; local component state only |
| UI libraries | None installed |
| CSS | Vite demo styles in `src/style.css`; no Bootstrap/AdminLTE |
| TypeScript | Strict-ish; `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` enabled |
| Package manager | pnpm 12 with `pnpm-lock.yaml` |
| AdminLTE 4.10.1 | Local dist only; `admin-lte@4.10.1` is **not published on npm** (latest is 4.10.0) |
| AdminLTE CSS | Bundles Bootstrap **5.3.8** — importing Bootstrap CSS separately would duplicate it |
| AdminLTE JS | Vanilla TS, exports `initialize`/`teardown` plus component classes; auto-inits on `DOMContentLoaded` |

### Blocking cleanup

`src/style.css` must be removed from `main.ts` and deleted. It contains:

```css
#app {
  width: 1126px;
  text-align: center;
  border-inline: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}
```

That rule alone will break the AdminLTE `.app-wrapper` grid. Also delete `HelloWorld.vue`, `src/assets/hero.png`, `src/assets/vite.svg`, and `src/assets/vue.svg`.

---

## 3. Key decision: CSS-first, Vue-owned behaviour (recommended)

AdminLTE's own FAQ advises SPA frameworks to use AdminLTE **only for CSS** and implement interactive parts natively, rather than wrapping its DOM plugins:

> "We don't recommend wrapping AdminLTE's jQuery-era plugins in SPA framework components — it's a maintenance burden that outweighs the visual win." — `docs/faq.html`

That guidance still holds for AdminLTE 4's vanilla plugins: they query the DOM on `DOMContentLoaded`, mutate classes directly, and assume page-level ownership of the DOM.

### Options compared

| Approach | Description | Verdict |
|---|---|---|
| **A. CSS-first (recommended)** | Import AdminLTE CSS; implement sidebar, treeview, theme, search, cards in Vue. Use Bootstrap JS only for dropdowns/modals/tooltips. | Best control, no double-ownership, clean TypeScript |
| **B. Hybrid** | CSS-first, plus reuse selected AdminLTE exports (`ColorMode`, `AccessibilityManager`, `initialize`/`teardown`). | Acceptable if you need exact AdminLTE behaviour; test re-init carefully |
| **C. Full plugin wrappers** | Wrap `PushMenu`, `Treeview`, `CardWidget`, `DirectChat`, `SidebarSearch` in Vue directives/components. | **Not recommended**; two systems mutate the same DOM |

### Consequences for this project

- **No `admin-lte` JavaScript import** in the default path. Only its CSS (and optionally its assets) is vendored.
- **Bootstrap JS** is still useful: dropdowns, modals, offcanvas, collapse, tooltips. Its delegated data API is SPA-safe.
- **Theme, sidebar, treeview, search, card widgets, fullscreen** are implemented in Vue.
- The AdminLTE HTML pages remain the **visual reference**, not a runtime dependency.

---

## 4. Version and dependency plan

### 4.1 Runtime dependencies

| Package | Version | Purpose | Notes |
|---|---|---|---|
| `vue` | 3.5.44 | Existing | Keep |
| `vue-router` | **5.4.0** | SPA routing | Peer requires Vue `^3.5.34` / Vite `^7.3 || ^8` — scaffold satisfies both |
| `bootstrap` | **5.3.8** | Bootstrap JS data API | AdminLTE peer dependency; do **not** import its CSS |
| `@popperjs/core` | 2.11.8 | Bootstrap positioning | Transitive via `bootstrap`; pin only if imported directly |
| `bootstrap-icons` | **1.13.2** | Icon font | Import CSS; Vite handles font files |
| `@fontsource/source-sans-3` | **5.3.1** | AdminLTE typeface | Removes the CDN font dependency |
| `overlayscrollbars` | **2.17.0** | Sidebar scrollbars | Optional; only used on desktop |
| `chart.js` | **4.6.1** | Dashboard charts | Optional, phase 4 |
| `pinia` | **4.1.0** | Global state | Optional; composables are enough for the shell |

### 4.2 AdminLTE itself — choose one

| Option | How | Trade-off |
|---|---|---|
| **A. Vendor local 4.10.1 (recommended)** | Copy `css/adminlte.min.css`, optional color/RTL sheets, and `assets/img` from `C:\Users\Anakin\Other\admin-lte-4` into `src/styles/` + `src/assets/adminlte/`. | Exact parity with the templates being ported; 4.10.1 is unpublished on npm. Manual upgrade step. |
| **B. npm `admin-lte@4.10.0`** | `pnpm add admin-lte@4.10.0` and import `admin-lte/dist/css/adminlte.min.css`. | Package-managed updates; 4.10.0 is slightly behind the 4.10.1 source. Switch to 4.10.1 when published. |

**Recommendation:** Option A for the first integration, because every visual reference in `admin-lte-4` is 4.10.1. Record provenance in `src/styles/VENDOR.md` (version, source path, date, license). Keep the MIT header intact.

If you later reuse AdminLTE JS in the hybrid path, copy `js/adminlte.esm.js` and `js/types/` too, or install npm 4.10.0 for its `types` export.

### 4.3 Development dependencies

| Package | Version | Purpose |
|---|---|---|
| `vitest` | 5.0.5 | Unit tests (requires Node 22.12+/24) |
| `@vue/test-utils` | 2.5.1 | Component tests |
| `happy-dom` | 21.0.4 | Fast DOM environment |
| `@playwright/test` | 1.64.1 | Optional E2E/visual tests |
| `sass` | 1.106.1 | Optional: only if customizing AdminLTE SCSS |
| `@types/bootstrap` | 5.2.11 | Optional: programmatic Bootstrap APIs |
| `eslint` | 10.13.0 | Optional linting (scaffold has none) |
| `prettier` | 3.9.10 | Optional formatting |

### 4.4 Install commands

```bash
# Core
pnpm add vue-router@5.4.0 bootstrap@5.3.8 bootstrap-icons@1.13.2 \
  @fontsource/source-sans-3@5.3.1

# Optional
pnpm add overlayscrollbars@2.17.0
pnpm add chart.js@4.6.1
pnpm add pinia@4.1.0

# Testing / tooling
pnpm add -D vitest@5.0.5 @vue/test-utils@2.5.1 happy-dom@21.0.4
pnpm add -D @playwright/test@1.64.1   # optional
```

---

## 5. Target file structure

```text
src/
├── main.ts
├── App.vue
├── router/
│   └── index.ts
├── layouts/
│   ├── AdminLayout.vue
│   ├── AuthLayout.vue
│   └── BlankLayout.vue
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   ├── AppFooter.vue
│   │   ├── AppBreadcrumb.vue
│   │   ├── SidebarBrand.vue
│   │   ├── SidebarSearch.vue
│   │   ├── SidebarMenu.vue
│   │   ├── SidebarMenuItem.vue
│   │   ├── ThemeToggle.vue
│   │   ├── NotificationsMenu.vue
│   │   ├── MessagesMenu.vue
│   │   ├── UserMenu.vue
│   │   └── SkipLinks.vue
│   ├── ui/
│   │   ├── AppCard.vue
│   │   ├── SmallBox.vue
│   │   ├── InfoBox.vue
│   │   └── AppModal.vue
│   └── charts/
│       └── LineChart.vue
├── composables/
│   ├── useTheme.ts
│   ├── useSidebar.ts
│   ├── useMediaQuery.ts
│   ├── useOverlayScrollbars.ts
│   ├── useFullscreen.ts
│   └── useAdminLteJs.ts        # only for hybrid path
├── styles/
│   ├── adminlte.min.css        # vendored 4.10.1
│   ├── adminlte-colors.css     # optional
│   ├── app.css                 # project tokens/overrides (after AdminLTE)
│   └── VENDOR.md
├── types/
│   ├── nav.ts
│   └── router.d.ts
├── data/
│   └── navigation.ts           # typed nav model
├── views/
│   ├── DashboardView.vue
│   ├── LoginView.vue
│   ├── NotFoundView.vue
│   └── ...                     # migrated pages
└── assets/
    └── adminlte/
        └── img/                # avatars, logo, photos
```

`index.html` keeps the AdminLTE body classes and the pre-paint theme script.

---

## 6. Implementation phases

### Phase 0 — Baseline and decisions (0.5 day)

- [ ] Confirm AdminLTE source strategy (§4.2): vendor 4.10.1 vs npm 4.10.0.
- [ ] Decide whether Pinia is needed; default is no.
- [ ] Capture reference screenshots of `index.html`, `index2.html`, `index3.html` at 1440/1024/768/375 px.
- [ ] Record the current `pnpm build` output as the baseline.

**Exit:** decisions documented; no code changes yet.

### Phase 1 — Dependencies, CSS, and bootstrapping (0.5–1 day)

- [ ] Delete Vite demo files and remove `./style.css` from `main.ts`.
- [ ] Vendor AdminLTE CSS/assets (or install npm 4.10.0).
- [ ] Add dependencies from §4.
- [ ] Add `index.html` theme script + body classes.
- [ ] Import CSS in the correct order (§7.1).
- [ ] Add `@` alias in Vite and tsconfig.
- [ ] Verify a blank page renders with AdminLTE fonts, icons, and background.

**Exit:** no console errors; computed body font is Source Sans 3; no duplicate Bootstrap CSS.

### Phase 2 — Static app shell (2–3 days)

- [ ] `AdminLayout.vue` with `.app-wrapper` and grid areas.
- [ ] `AppHeader.vue`: sidebar toggle, brand, search, messages, notifications, theme, user menu.
- [ ] `AppSidebar.vue`: brand, search, menu, footer.
- [ ] `AppFooter.vue`.
- [ ] Port the default sidebar menu from `index.html` into typed `navigation.ts`.
- [ ] Verify visual parity against the reference screenshots.

**Exit:** shell matches AdminLTE at all four breakpoints; no interactive behaviour yet.

### Phase 3 — Router, sidebar state, theme (2–3 days)

- [ ] Add `vue-router@5`, routes, lazy views, `RouteMeta` typing.
- [ ] Replace `<a href>` with `<RouterLink>`; active classes from the route.
- [ ] Implement recursive `SidebarMenuItem` with `menu-open` + `aria-expanded`.
- [ ] Implement `useSidebar` (collapse, mobile overlay, persistence).
- [ ] Implement `useTheme` (light/dark/auto, no flash, persistence).
- [ ] Implement `SidebarSearch` as a Vue filter.
- [ ] Add skip links and focus handling.

**Exit:** navigation never reloads the page; active/treeview state is route-driven; theme and sidebar survive reloads; keyboard usable.

### Phase 4 — Dashboard (1–2 days)

- [ ] Port the four small-box widgets.
- [ ] Port cards, tables, and the direct-chat card.
- [ ] Add one Chart.js line chart via a `LineChart.vue` wrapper (optional).
- [ ] Replace demo data with typed fixtures.

**Exit:** dashboard is functionally equivalent to `index.html` (minus drag-and-drop until phase 5).

### Phase 5 — Reusable widgets (1–2 days)

- [ ] `AppCard` with collapse/remove/maximize (Vue state, AdminLTE classes).
- [ ] `SmallBox`, `InfoBox`.
- [ ] `DirectChat` component.
- [ ] Optional SortableJS integration for draggable cards.

**Exit:** widgets are reusable and have unit tests.

### Phase 6 — Page migration waves (5–10 days)

Migrate in this order, one wave per PR:

1. Auth: `examples/login`, `login-v2`, `register`, `register-v2`, `lockscreen`, `forgot-password`.
2. Forms: `forms/elements`, `layout`, `validation`, `wizard`, `editors`, `advanced`.
3. Tables: `tables/simple`, `tables/data`.
4. Charts: `charts/chartjs`.
5. Pages: calendar, chat, kanban, projects, file-manager, invoice, profile, settings, pricing, FAQ, gallery, search-results, 404/500.
6. UI/widgets: `UI/*`, `widgets/*`.

For each wave: route entry, typed props/data, lazy import, visual check, no page-level inline scripts.

**Exit:** each migrated page is reachable by router and matches its static reference.

### Phase 7 — Optional parity features (2–4 days)

- [ ] RTL stylesheet + `dir` handling.
- [ ] SCSS build if compile-time token customization is required.
- [ ] Hybrid AdminLTE JS modules if any behaviour is not worth reimplementing.
- [ ] Docs pages (optional; usually not needed in an app).

### Phase 8 — Hardening and CI (2–3 days)

- [ ] Unit/component/E2E tests.
- [ ] Accessibility audit (axe + keyboard).
- [ ] Performance budget and bundle analysis.
- [ ] `vue-tsc -b`, lint, build in CI.
- [ ] Document conventions in `integrations/README.md`.

**Estimated total:** 2–4 weeks for one developer, depending on how many demo pages are actually required.

---

## 7. Technical design

### 7.1 Global CSS and JS import order

`src/main.ts`:

```ts
import { createApp } from 'vue'

// 1. Fonts and icons
import '@fontsource/source-sans-3/index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// 2. Optional scrollbar styling
import 'overlayscrollbars/overlayscrollbars.css'

// 3. AdminLTE last — it bundles Bootstrap 5.3.8 CSS.
//    Never import 'bootstrap/dist/css/bootstrap.css' as well.
import '@/styles/adminlte.min.css'
import '@/styles/app.css'

// 4. Bootstrap JS data API only (CSS already came with AdminLTE)
import 'bootstrap'

import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

If bundle size matters, replace `import 'bootstrap'` with side-effect imports of only the plugins used:

```ts
import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/collapse'
import 'bootstrap/js/dist/modal'
import 'bootstrap/js/dist/tooltip'
```

`src/styles/app.css` is the only place for project overrides, loaded **after** AdminLTE:

```css
:root {
  --lte-sidebar-width: 260px;
}

/* Example: keep the AdminLTE dark sidebar even in light mode */
.app-sidebar {
  /* use AdminLTE variables, not hard-coded colors */
}
```

### 7.2 `index.html`

The body classes and the pre-paint theme script are essential. The script must stay inline in `<head>` so it runs before first paint:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#007bff" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
    <title>AdminLTE 4 | Vue</title>

    <script>
      (() => {
        'use strict'
        const root = document.documentElement
        if (root.getAttribute('data-lte-color-mode') === 'off') return

        const STORAGE_KEY = 'appTheme'
        let stored = null
        try { stored = localStorage.getItem(STORAGE_KEY) } catch {}

        const authored = root.getAttribute('data-bs-theme')
        let resolved = 'light'
        if (stored === 'dark' || stored === 'light') resolved = stored
        else if (authored === 'dark' || authored === 'light') resolved = authored
        else if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) resolved = 'dark'

        root.setAttribute('data-bs-theme', resolved)
        root.style.colorScheme = resolved
        if (resolved !== authored) root.setAttribute('data-appTheme-resolved', '')
      })()
    </script>
  </head>
  <body class="layout-fixed sidebar-expand-lg bg-body-tertiary">
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Notes:

- The script mirrors AdminLTE's precedence: stored choice → authored theme → OS preference.
- `data-appTheme-resolved` prevents the theme composable from mistaking a computed value for an authored one.
- If you add a strict CSP, this inline script needs a nonce or hash.

### 7.3 App shell mapping

AdminLTE's grid does not depend on source order; keep the same markup order as the templates:

```vue
<!-- AdminLayout.vue -->
<template>
  <div class="app-wrapper">
    <AppHeader />
    <AppSidebar />
    <main id="main" class="app-main">
      <div class="app-content-header">
        <div class="container-fluid">
          <AppBreadcrumb />
        </div>
      </div>
      <div class="app-content">
        <div class="container-fluid">
          <RouterView />
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
```

Component mapping:

| AdminLTE markup | Vue component |
|---|---|
| `<nav class="app-header navbar ...">` | `AppHeader.vue` |
| `<aside class="app-sidebar ...">` | `AppSidebar.vue` |
| `.sidebar-brand` / `.brand-link` | `SidebarBrand.vue` |
| `.sidebar-search` | `SidebarSearch.vue` |
| `ul.sidebar-menu` | `SidebarMenu.vue` + recursive `SidebarMenuItem.vue` |
| `<main class="app-main">` | inside `AdminLayout.vue` |
| `.app-content-header` | `AppBreadcrumb.vue` |
| `<footer class="app-footer">` | `AppFooter.vue` |
| `.small-box`, `.info-box`, `.card` | `SmallBox.vue`, `InfoBox.vue`, `AppCard.vue` |

**Important:** the default AdminLTE sidebar uses `data-bs-theme="dark"` on `<aside class="app-sidebar ...">`, which keeps it dark even in light mode. Preserve it intentionally; do not let the global theme toggle override it unless you want a light sidebar.

### 7.4 Theme handling

Implement `useTheme` as a module-level singleton so every component shares the same state.

Parity requirements:

| AdminLTE behaviour | Vue implementation |
|---|---|
| Storage key | `appTheme` |
| Values | `light`, `dark`, `auto` |
| Applied attribute | `data-bs-theme` on `<html>` |
| Color scheme | `document.documentElement.style.colorScheme` |
| Toggle attribute | `data-bs-theme-value` |
| Icon attribute | `data-appTheme-icon` |
| Active state | `.active`, `aria-pressed`, `.bi-check-lg` visibility |
| Change event | `changed.lte.color-mode` with `{ theme, resolved }` |
| Opt-out | `data-lte-color-mode="off"` on `<html>` |
| OS changes | `matchMedia('(prefers-color-scheme: dark)')` listener |

```ts
// src/composables/useTheme.ts
import { computed, ref } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'appTheme'
const media = window.matchMedia('(prefers-color-scheme: dark)')

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
  } catch {}

  if (document.documentElement.hasAttribute('data-appTheme-resolved')) return 'auto'

  const authored = document.documentElement.getAttribute('data-bs-theme')
  if (authored === 'light' || authored === 'dark') return authored
  return 'auto'
}

const theme = ref<Theme>(readTheme())
const resolved = computed<'light' | 'dark'>(() =>
  theme.value === 'auto' ? (media.matches ? 'dark' : 'light') : theme.value,
)

function apply() {
  const root = document.documentElement
  root.setAttribute('data-bs-theme', resolved.value)
  root.style.colorScheme = resolved.value
}

// Register once for the lifetime of the module.
media.addEventListener('change', () => {
  if (theme.value === 'auto') apply()
})

export function useTheme() {
  function setTheme(next: Theme) {
    theme.value = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    apply()
    document.dispatchEvent(
      new CustomEvent('changed.lte.color-mode', {
        detail: { theme: next, resolved: resolved.value },
      }),
    )
  }

  return { theme, resolved, setTheme }
}
```

Also update the toggle UI's `active` and `aria-pressed` from `theme.value`, and show the matching icon.

### 7.5 Sidebar and treeview

AdminLTE uses body classes, not component-local state:

| State | Class on `<body>` |
|---|---|
| Collapsed desktop sidebar | `sidebar-collapse` |
| Mobile sidebar open | `sidebar-open` |
| Mini mode (optional) | `sidebar-mini` |
| Expansion breakpoint | `sidebar-expand-lg` |

`useSidebar` should:

- Read persistence from `appSidebarState` — AdminLTE stores the **class name** (`'sidebar-collapse'` or `'sidebar-open'`), not a boolean.
- Use the same breakpoint as AdminLTE: **991.98 px** (`sidebar-expand-lg`).
- On mobile: toggle `sidebar-open`, add/remove an overlay, close on route change, close on `Escape`, restore focus to the toggle.
- On desktop: toggle `sidebar-collapse`, persist, and never apply `sidebar-open`.
- React to `resize`/`matchMedia` and clean up listeners on unmount.

Treeview:

- `menu-open` on the `<li>`; `aria-expanded` on the toggle link.
- Open state derived from the current route, not from imperative DOM state:
  ```ts
  const isOpen = computed(() =>
    item.children?.some(
      (child) => route.path === child.to || route.path.startsWith(`${child.to}/`),
    ) ?? false,
  )
  ```
- Use `RouterLink` for leaves and a button/link with `@click.prevent` for parents.
- Do not run AdminLTE's `Treeview` plugin alongside this logic.

Sidebar search:

- Bind an input to a `ref<string>`.
- Filter the nav model recursively, hide headers with no matches, and show an empty state with `role="status"`.
- Keep `aria-label`/`visually-hidden` labels from the template.

### 7.6 Router

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    layout?: 'admin' | 'auth' | 'blank'
    breadcrumb?: string[]
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard', layout: 'admin' },
  },
  {
    path: '/pages/calendar',
    name: 'calendar',
    component: () => import('@/views/CalendarView.vue'),
    meta: { title: 'Calendar', layout: 'admin', breadcrumb: ['Pages', 'Calendar'] },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404', layout: 'blank' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | AdminLTE 4` : 'AdminLTE 4'
})

export default router
```

App layout selection:

```vue
<!-- App.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const route = useRoute()
const layout = computed(() => {
  switch (route.meta.layout) {
    case 'auth': return AuthLayout
    case 'blank': return BlankLayout
    default: return AdminLayout
  }
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
```

Keep `AdminLayout` mounted across admin routes. Only the inner `RouterView` should change; this avoids re-initializing sidebar/scrollbars on every navigation.

### 7.7 Card widgets

AdminLTE's card behaviour is mostly CSS classes:

- `collapsed-card`, `collapsing-card`, `expanding-card`, `was-collapsed`
- `maximized-card`
- card removal

Implement state in `AppCard.vue` (`collapsed`, `maximized`) and bind classes. Use `<Transition>` or AdminLTE's CSS transitions. Do not import `CardWidget` unless you choose the hybrid path.

### 7.8 OverlayScrollbars

Only initialize on desktop (`window.innerWidth > 992`), matching the AdminLTE page script:

```ts
import { OverlayScrollbars } from 'overlayscrollbars'

const instance = OverlayScrollbars(sidebarWrapperEl, {
  scrollbars: { theme: 'os-theme-light', autoHide: 'leave', clickScroll: true },
})

// on unmount
instance.destroy()
```

Use `destroy()` on unmount/HMR and re-create when crossing the breakpoint. Do not use `new OverlayScrollbars` (v2 exports a factory function).

### 7.9 RTL

AdminLTE ships a separate, fully mirrored stylesheet (`adminlte.rtl.min.css`). Options:

1. **Runtime switch (recommended for multi-locale apps):** copy both CSS files to `public/vendor/adminlte/`, add a managed `<link id="lte-direction">`, and swap `href` when the locale changes. Set `document.documentElement.dir = 'rtl'`.
2. **Separate build:** emit `index.rtl.html` with the RTL sheet. Simpler but duplicates the app build.
3. **Skip for MVP:** ship LTR only; add RTL when an RTL locale is actually required.

Do **not** load both LTR and RTL sheets simultaneously.

### 7.10 Assets, fonts, icons

- Copy AdminLTE images (`assets/img/*`) to `src/assets/adminlte/img/` and import them, so Vite fingerprints and inlines/optimizes them:
  ```ts
  import logo from '@/assets/adminlte/img/AdminLTELogo.png'
  ```
- Alternatively, put them in `public/adminlte/img/` and reference `/adminlte/img/...`; this avoids imports but bypasses hashing.
- `@fontsource/source-sans-3` replaces the CDN font. Remove the `<link rel="preload">`/CDN font tag from copied HTML.
- `bootstrap-icons` npm CSS points at bundled font files; no CDN needed.
- Keep the MIT license header in vendored AdminLTE CSS and add `THIRD-PARTY-NOTICES.md`.

### 7.11 TypeScript conventions

The scaffold enables:

```json
"noUnusedLocals": true,
"noUnusedParameters": true,
"erasableSyntaxOnly": true
```

Implications:

- **No `enum`** — use string unions or `as const` objects:
  ```ts
  export type Theme = 'light' | 'dark' | 'auto'
  export const THEMES = ['light', 'dark', 'auto'] as const
  ```
- **No parameter properties** (`constructor(private x: ...)`) — declare fields explicitly.
- **No namespaces** in runtime code.

Typed navigation model:

```ts
// src/types/nav.ts
export interface NavItem {
  label: string
  to?: string
  icon?: string
  badge?: string
  children?: NavItem[]
}
```

Use `satisfies NavItem[]` for the navigation config so route typos surface in the editor.

Add route meta augmentation in `src/types/router.d.ts` (as shown in §7.6) so `route.meta.layout` is typed.

If you import AdminLTE JS in the hybrid path, use its published declarations:

```ts
import type { ColorMode } from 'admin-lte'
```

The npm package exposes `types: dist/js/types/adminlte.d.ts`. For a vendored JS copy, copy `js/types/` alongside and add a small module declaration.

### 7.12 Optional hybrid: reusing AdminLTE JS

Only if a specific behaviour is not worth reimplementing. Add one composable and initialize **after** Vue has rendered:

```ts
// src/composables/useAdminLteJs.ts
import { nextTick, onBeforeUnmount } from 'vue'
import { initialize, teardown } from 'admin-lte'
import router from '@/router'

export function useAdminLteJs() {
  const stop = router.afterEach(async () => {
    await nextTick()
    initialize()
  })

  onBeforeUnmount(() => {
    stop()
    teardown()
  })
}
```

Warnings:

- `initialize()` tears down and replays **all** AdminLTE lifecycle callbacks, not just one module.
- It will attach listeners to DOM that Vue may later replace. Mixing it with Vue-owned sidebar/theme/search logic causes double toggles.
- Pick one owner per feature. If you own the shell in Vue, do not also import `PushMenu`/`Treeview`/`ColorMode`.
- AdminLTE's ESM bundle also registers a document-level theme click handler at import time, even before `initialize()`. Prefer CSS-only if you implement theme yourself.

### 7.13 Accessibility

Native Vue implementation:

- `SkipLinks.vue` as the first focusable element: "Skip to main content" (`#main`) and "Skip to navigation" (`#navigation`).
- `<main id="main" tabindex="-1">` and `<nav id="navigation">`.
- Mobile sidebar: focus trap, `Escape` to close, restore focus to the toggle.
- Visible focus styles; do not remove `:focus-visible` outlines.
- Respect `prefers-reduced-motion` for sidebar/card animations.
- Announce route changes via an `aria-live="polite"` region or focus the `<h1>` after navigation.
- Keep labels/`aria-label`s from AdminLTE markup (search, icon-only buttons, badges).

Optional: reuse AdminLTE's `AccessibilityManager`, but it injects skip links and landmarks into the DOM outside Vue. Choose either the Vue component or the manager, not both.

---

## 8. Testing and QA

| Layer | Tool | Coverage |
|---|---|---|
| Types | `vue-tsc -b` | Components, composables, router meta |
| Unit | Vitest | `useTheme`, `useSidebar`, nav filtering |
| Component | `@vue/test-utils` | Sidebar treeview, theme toggle, AppCard |
| E2E | Playwright | Routing, mobile sidebar, theme persistence, no reload |
| A11y | axe-core / Playwright | Landmarks, names, contrast, keyboard |
| Visual | Playwright screenshots | Compare against AdminLTE references at 4 breakpoints |

Suggested scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "vue-tsc -b",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

Manual smoke matrix:

- [ ] 1440 px: sidebar expanded, fixed layout, charts, dropdowns.
- [ ] 1024 px: sidebar behaviour at `lg` edge.
- [ ] 768 px / 375 px: sidebar overlay, hamburger, no horizontal scroll.
- [ ] Light/dark/auto: no flash on reload; OS change in auto mode; sidebar remains dark by design.
- [ ] Keyboard: skip links, tab order, treeview toggles, Escape closes mobile sidebar.
- [ ] Route changes: active menu, open parent, document title, scroll to top.
- [ ] Refreshing a deep link works (history fallback in dev and deploy).

---

## 9. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Duplicate Bootstrap CSS | Cascade bugs, larger bundle | AdminLTE CSS already includes Bootstrap; never import Bootstrap CSS |
| Vite demo `#app` styles | Layout completely broken | Delete `src/style.css`, remove its import |
| AdminLTE JS vs Vue ownership | Double toggles, stale listeners | CSS-first; one owner per feature; avoid hybrid unless necessary |
| Theme flash | Visible wrong theme | Keep the pre-paint script inline in `index.html` |
| AdminLTE 4.10.1 unpublished on npm | Install fallback/version drift | Vendor local 4.10.1 CSS/assets; track npm publication |
| Vue Router 5 / Pinia 4 are new majors | API surprises | Pin exact versions; read v5/v4 migration notes; test routing early |
| `erasableSyntaxOnly` | `enum`/parameter-property build errors | Use unions and `as const` |
| OverlayScrollbars HMR/double init | Duplicate scrollbars | `destroy()` on unmount; guard initialization |
| Mobile sidebar focus/scroll | Accessibility regression | Focus trap + `Escape` + body scroll lock; test with keyboard |
| RTL stylesheet switching | Broken layout | Load exactly one direction; test with `dir="rtl"` |
| Inline theme script + strict CSP | Script blocked | Add nonce/hash or move to an allowed external early script |
| Copying HTML verbatim | Broken `./assets/...` paths and inline scripts | Rewrite assets, remove page scripts, convert to components |

---

## 10. Definition of done

- [ ] `pnpm build` passes (`vue-tsc -b && vite build`).
- [ ] Dashboard matches AdminLTE 4.10.1 at 1440/1024/768/375 px.
- [ ] Router navigation is client-side; deep links work; titles and active menu update.
- [ ] Sidebar state and theme persist across reloads; no flash of wrong theme.
- [ ] Light/dark/auto mode works, including OS changes in auto mode.
- [ ] Keyboard and screen-reader basics pass (skip links, focus, labels).
- [ ] No console errors, no duplicate Bootstrap CSS, no AdminLTE page-level scripts.
- [ ] Only migrated pages are shipped; unused demo assets are removed.
- [ ] `src/styles/VENDOR.md` records AdminLTE provenance and upgrade steps.
- [ ] CI runs typecheck, unit tests, and build.

---

## 11. Appendix — reference snippets

### A. `vite.config.ts` alias

```ts
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

Add to `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

### B. `useSidebar.ts` skeleton

```ts
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const STORAGE_KEY = 'appSidebarState'
const MOBILE_MAX = 991.98

const collapsed = ref(false)
const mobileOpen = ref(false)
const isMobile = ref(false)

export function useSidebar() {
  function apply() {
    const body = document.body
    body.classList.toggle('sidebar-collapse', collapsed.value && !isMobile.value)
    body.classList.toggle('sidebar-open', mobileOpen.value && isMobile.value)
  }

  function syncViewport() {
    isMobile.value = window.innerWidth <= MOBILE_MAX
    if (!isMobile.value) mobileOpen.value = false
    apply()
  }

  function toggle() {
    if (isMobile.value) {
      mobileOpen.value = !mobileOpen.value
    } else {
      collapsed.value = !collapsed.value
      try {
        localStorage.setItem(STORAGE_KEY, collapsed.value ? 'sidebar-collapse' : 'sidebar-open')
      } catch {}
    }
    apply()
  }

  function closeMobile() {
    mobileOpen.value = false
    apply()
  }

  onMounted(() => {
    try {
      collapsed.value = localStorage.getItem(STORAGE_KEY) === 'sidebar-collapse'
    } catch {}
    syncViewport()
    window.addEventListener('resize', syncViewport, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', syncViewport)
  })

  return { collapsed: computed(() => collapsed.value), mobileOpen, isMobile, toggle, closeMobile }
}
```

### C. Recursive `SidebarMenuItem.vue` skeleton

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { NavItem } from '@/types/nav'

const props = defineProps<{ item: NavItem; depth?: number }>()
const route = useRoute()

const children = computed(() => props.item.children ?? [])
const hasChildren = computed(() => children.value.length > 0)

function matches(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const isOpen = computed(() => children.value.some((child) => child.to && matches(child.to)))
const isActive = computed(() => (props.item.to ? matches(props.item.to) : false))
</script>

<template>
  <li class="nav-item" :class="{ 'menu-open': isOpen }">
    <RouterLink
      v-if="item.to && !hasChildren"
      :to="item.to"
      class="nav-link"
      :class="{ active: isActive }"
    >
      <i v-if="item.icon" class="nav-icon" :class="item.icon" aria-hidden="true" />
      <p>{{ item.label }}</p>
    </RouterLink>

    <a
      v-else
      href="#"
      class="nav-link"
      role="button"
      :aria-expanded="isOpen"
      @click.prevent
    >
      <i v-if="item.icon" class="nav-icon" :class="item.icon" aria-hidden="true" />
      <p>
        {{ item.label }}
        <i class="nav-arrow bi bi-chevron-right" aria-hidden="true" />
      </p>
    </a>

    <ul v-if="hasChildren" class="nav nav-treeview">
      <SidebarMenuItem
        v-for="child in children"
        :key="child.to ?? child.label"
        :item="child"
        :depth="(depth ?? 0) + 1"
      />
    </ul>
  </li>
</template>
```

For production, replace the inert parent `<a href="#">` with a button that toggles an explicit `open` state; the route-only derivation above is a starting point for accordion menus.

### D. `src/types/nav.ts`

```ts
export interface NavItem {
  label: string
  to?: string
  icon?: string
  badge?: string
  children?: NavItem[]
}
```

### E. Migration checklist for each ported page

- [ ] Remove `<html>`, `<head>`, `<body>`, `.app-wrapper`, header/sidebar/footer (provided by layout).
- [ ] Keep only `.app-content` content inside the view.
- [ ] Replace `./assets/...` with imported assets or `/adminlte/img/...`.
- [ ] Replace `href="..."` with `<RouterLink :to="...">`.
- [ ] Convert inline demo scripts to composables or component lifecycle.
- [ ] Replace static table/list data with typed fixtures or API calls.
- [ ] Verify at all four breakpoints and both themes.

---

## 12. Recommended first PR

1. Remove Vite demo files and `src/style.css`.
2. Add dependencies.
3. Vendor AdminLTE 4.10.1 CSS + images.
4. Add `index.html` theme script and body classes.
5. Add `RouterView` + a placeholder dashboard.
6. Add `AdminLayout`, `AppHeader`, `AppSidebar`, `AppFooter` with static markup.
7. Verify visual parity and no console errors.

This gives a reviewable foundation before any interactive behaviour is wired up.
