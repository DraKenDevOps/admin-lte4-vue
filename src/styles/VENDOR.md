# Vendored AdminLTE assets

| | |
|---|---|
| **Package** | AdminLTE |
| **Version** | 4.10.1 |
| **Source** | Local checkout at `C:\Users\Anakin\Other\admin-lte-4` (dist 4.10.1) |
| **Vendored files** | `src/styles/adminlte.min.css`, selected `src/assets/adminlte/img/*` |
| **Vendored on** | 2026-10-28 |
| **License** | MIT (header retained in the stylesheet) |

The stylesheet is unmodified except for removing the trailing `sourceMappingURL` comment,
because the 800 KB source map is not shipped.

## Why vendored instead of npm

`admin-lte@4.10.1` is not published on npm (the registry's latest is 4.10.0), and the
visual reference pages used for this port are all 4.10.1. Vendoring keeps exact parity.
`admin-lte.min.css` already bundles Bootstrap 5.3.8, so **Bootstrap CSS must never be
imported separately**.

## Upgrading

1. Replace `src/styles/adminlte.min.css` with the new `css/adminlte.min.css`.
2. Copy any newly referenced images from `assets/img/` into `src/assets/adminlte/img/`.
3. Check the AdminLTE changelog for renamed CSS variables and classes.
4. Run `pnpm build` and the manual smoke matrix in
   `integrations/ADMINLTE-VUE-INTEGRATION-PLAN.md` §8.
5. Update the version/date in this file.

## Not vendored (deliberately)

- AdminLTE JavaScript — the shell is implemented in Vue (CSS-first approach).
- `adminlte.rtl.min.css` — RTL is a later optional phase.
- `adminlte-colors*.css` — not used by the ported screens.
- Demo-only images (photos, product shots, backgrounds) — copy on demand when a page
  that needs them is migrated.
