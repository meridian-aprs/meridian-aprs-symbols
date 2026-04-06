# CLAUDE.md — meridian-aprs-symbols

## What this repo is

A hand-authored SVG icon set for APRS symbols, used by the Meridian APRS app. Source SVGs in `src/` are transformed by a build pipeline into multiple variants and output formats in `dist/`. The goal is to reach ~200 symbols covering the full APRS symbol table.

## Key commands

```bash
npm run build          # Build only new/missing symbols (skip-if-exists)
npm run build:force    # Rebuild everything from scratch
npm run build:svg      # SVG stage only
node build/build.js --variant flat-badge  # One variant only
npm run clean          # Remove dist/
```

Open `preview.html` in a browser to review output — it shows all three variants across four map tile backgrounds.

## Adding a new symbol

1. Add an entry to `symbols.json` (`name`, `aprs_code`, `table`, `filename`, `color`, `dark`, `category`, `description`)
2. Create `src/<table>/<filename>.svg` — see STYLE_GUIDE.md for authoring rules
3. Run `npm run build` — only the new symbol gets built
4. Open `preview.html` and verify at 16px, 32px, and 64px across all three variants
5. Commit `src/`, `symbols.json`, `SYMBOLS.md`, and `dist/` together on a feature branch
6. Open a PR — CI validates that `dist/svg/` matches source before merge

## Variant system

Three variants are built from each source SVG:

| Variant | Use case | Detail color |
|---|---|---|
| `flat-badge` | Any background (sparse maps) | `rgba(0,0,0,0.2)` on white icon |
| `flat-nobadge` | Light map tiles | `rgba(0,0,0,0.25)` |
| `flat-nobadge-dark` | Dark map tiles | `rgba(255,255,255,0.35)` |

Variants are defined in `variants/*.json`. A `detailColor` field overrides the auto-resolved value.

## Color token rules (critical)

See STYLE_GUIDE.md for the full table. The short version:

- Structural fills: `var(--symbol-color)` / `var(--symbol-dark)`
- Interior details (windows, doors, drops, arcs): `var(--detail-color)` for fills AND strokes
- Absolute-dark elements (tires): `rgba(0,0,0,0.85)`
- Light-on-dark elements (wheel hub on tire): `rgba(255,255,255,0.45)`
- **Never use hex colors** — badge recoloring converts all hex fills to white and hex strokes to none
- **Never use `var(--symbol-dark)` on signal arcs** — it resolves to hex and gets removed in badge mode

## How the build pipeline works

`build/apply-variant.js` transforms each source SVG:
1. Substitutes `var(--symbol-color)` and `var(--symbol-dark)` with hex values
2. Substitutes `var(--detail-color)` with the variant-appropriate rgba value
3. For badge variants: recolors all hex fills → white, hex strokes → none, preserves `rgba(...)` values as-is
4. Injects the badge `<rect>` before icon content

`rgba(0,0,0,...)` and `rgba(255,255,255,...)` fills/strokes are preserved at their authored opacity — this is intentional so wheel tires and hubs render correctly.

## File structure

```
src/primary/        # Source SVGs (hand-authored)
src/alternate/      # Alternate table symbols (future)
variants/           # Variant config JSON files
build/              # Build pipeline scripts
dist/svg/           # Built SVGs (committed)
dist/png/           # Built PNGs at 16/32/64px (committed)
dist/sprite/        # Sprite sheets (committed)
dist/iconify/       # Iconify JSON (committed)
flutter/assets/     # Flutter-synced SVGs (committed)
symbols.json        # Symbol index (source of truth)
SYMBOLS.md          # Human-readable symbol table
STYLE_GUIDE.md      # Full authoring rules and pitfalls
preview.html        # Local visual review tool
```

## Git workflow

- Main branch requires PRs — always work on a feature branch
- Branch naming: `feat/add-<symbolname>` or `feat/add-<batch-description>`
- Commit `src/` + `dist/` together so the repo is always in a consistent state
- `npm run build:force` + `git diff dist/svg/` should always be clean before opening a PR

## Releases

Tag a version to trigger npm publish via CI (OIDC trusted publishing — no token needed):

```bash
npm version patch   # or minor / major — updates package.json and creates a git tag
git push --tags
```
