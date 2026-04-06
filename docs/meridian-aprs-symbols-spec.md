# meridian-aprs-symbols — Repo Spec & Claude Code Handoff

## Overview

`meridian-aprs-symbols` is a standalone open-source repository containing the APRS symbol icon set for Meridian APRS. It is designed to be useful both as an internal asset source for the Meridian Flutter app and as a community resource for other APRS applications.

**License:** CC BY 4.0  
**Attribution:** "APRS Symbols by Meridian APRS"  
**Repo name:** `meridian-aprs-symbols`  
**npm package:** `@meridian-aprs/symbols`  
**pub.dev package:** `meridian_aprs_symbols`  
**Primary consumer:** Meridian APRS (via pub.dev Flutter package)

---

## Goals

- Canonical SVG source for all APRS primary and alternate table symbols (~200 total)
- Two style variants for v1.0 (see Variants section); variant system designed for future expansion
- Automated build pipeline producing optimized SVGs, rasterized PNGs, and Iconify-compatible JSON
- npm package (`@meridian-aprs/symbols`) for web and JS consumers
- Flutter/Dart package (`meridian_aprs_symbols`) for pub.dev, consumed by Meridian APRS
- Sprite sheet output for community consumers (web apps, other clients)
- Symbol index mapping APRS two-character codes to filenames

---

## Variants

Two variants ship in v1.0. The variant system (JSON configs + build pipeline) is designed to support additional variants in the future without structural changes.

| Variant | Description | Meridian default |
|---|---|---|
| `flat-badge` | Flat white icon on solid color rounded-rect badge with dark border | ✅ Yes |
| `flat-nobadge` | Flat icon in symbol color, no background badge, transparent background | No |

**Why two variants:**
- `flat-badge` is the primary experience — easier to identify at a glance, reads well on satellite and terrain tile backgrounds where icon colors can get lost in the map
- `flat-nobadge` is for dense map scenarios where badge overlap becomes visually noisy; exposed as a user setting in Meridian
- Future variants (shadow, outline, etc.) can be added by dropping a new JSON config into `variants/` — no pipeline changes required

**Future variants to consider (not in scope for v1.0):**
- `shadow-badge` — raised, tactile feel with gradient and drop shadow
- `outline-nobadge` — lightweight outline-only icons for minimal map weight
- Auto badge/no-badge switching based on map zoom level is a Meridian app feature (tracked in Meridian's `FUTURE_FEATURES.md`), not a symbols repo concern

---

## Repository Structure

```
meridian-aprs-symbols/
│
├── src/                          # Canonical SVG source files
│   ├── primary/                  # Primary symbol table (/ prefix)
│   │   ├── house.svg
│   │   ├── car.svg
│   │   ├── person.svg
│   │   └── ...
│   └── alternate/                # Alternate symbol table (\ prefix)
│       └── ...
│
├── variants/                     # Variant config files (JSON)
│   ├── flat-badge.json           # ← default Meridian variant
│   └── flat-nobadge.json
│
├── flutter/                      # Flutter/Dart pub.dev package
│   ├── lib/
│   │   └── meridian_aprs_symbols.dart   # Dart API
│   ├── assets/
│   │   └── symbols/
│   │       ├── flat-badge/       # copied from dist/svg/flat-badge/ by build pipeline
│   │       └── flat-nobadge/     # copied from dist/svg/flat-nobadge/ by build pipeline
│   ├── pubspec.yaml
│   └── README.md
│
├── dist/                         # Build output (gitignored, generated)
│   ├── svg/
│   │   ├── flat-badge/
│   │   │   ├── primary/
│   │   │   └── alternate/
│   │   └── flat-nobadge/
│   │       ├── primary/
│   │       └── alternate/
│   ├── png/
│   │   ├── flat-badge/
│   │   │   ├── 16/
│   │   │   ├── 32/
│   │   │   └── 64/
│   │   └── flat-nobadge/
│   │       ├── 16/
│   │       ├── 32/
│   │       └── 64/
│   ├── sprite/
│   │   ├── flat-badge-16.png
│   │   ├── flat-badge-16.json
│   │   ├── flat-badge-32.png
│   │   ├── flat-badge-32.json
│   │   ├── flat-badge-64.png
│   │   ├── flat-badge-64.json
│   │   ├── flat-nobadge-16.png
│   │   ├── flat-nobadge-16.json
│   │   ├── flat-nobadge-32.png
│   │   ├── flat-nobadge-32.json
│   │   ├── flat-nobadge-64.png
│   │   └── flat-nobadge-64.json
│   └── iconify/
│       └── meridian-aprs.json    # Iconify-compatible icon set JSON
│
├── build/                        # Build scripts
│   ├── build.js                  # Main build entry point
│   ├── apply-variant.js          # Applies variant config to SVG source
│   ├── optimize.js               # SVGO optimization pass
│   ├── rasterize.js              # SVG → PNG via resvg-js
│   ├── sprite.js                 # PNG → sprite sheet via sharp
│   ├── iconify.js                # SVG → Iconify JSON format
│   └── flutter-sync.js           # Copies dist/svg/ into flutter/assets/symbols/
│
├── symbols.json                  # Master symbol index (see format below)
├── SYMBOLS.md                    # Human-readable symbol index
├── STYLE_GUIDE.md                # Visual style rules for contributing new symbols
├── README.md
├── package.json
└── .gitignore                    # dist/ and node_modules/ gitignored
```

---

## Variant Config Format

Each variant is a JSON file in `variants/` describing how to transform source SVGs during the build. The structure supports future depth styles (shadow, outline, etc.) via the `depth` field even if only `flat` is used in v1.0.

**`flat-badge.json`** (default Meridian variant):
```json
{
  "name": "flat-badge",
  "depth": "flat",
  "description": "Flat white icon on solid color rounded-rect badge with dark border. Default Meridian variant.",
  "icon": {
    "fill": "rgba(255,255,255,0.96)",
    "stroke": "none",
    "strokeWidth": 0
  },
  "badge": {
    "enabled": true,
    "fill": "symbol-color",
    "stroke": "symbol-dark",
    "strokeWidth": 3,
    "cornerRadius": 8
  }
}
```

**`flat-nobadge.json`**:
```json
{
  "name": "flat-nobadge",
  "depth": "flat",
  "description": "Flat icon in symbol color on transparent background. No badge.",
  "icon": {
    "fill": "symbol-color",
    "stroke": "symbol-dark",
    "strokeWidth": 1.5
  },
  "badge": {
    "enabled": false
  }
}
```

The special value `"symbol-color"` is substituted by the build pipeline with the per-symbol primary color from `symbols.json`. `"symbol-dark"` is substituted with the per-symbol dark/stroke color.

---

## Source SVG Format

Each source SVG is a **48×48 viewport**, transparent background, drawn as a plain icon with no badge. Colors are parameterized via CSS custom properties so the build pipeline can substitute per variant and per symbol:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <!-- var(--symbol-color) and var(--symbol-dark) substituted by build pipeline -->
  <polygon points="24,10 39,27 9,27"
    fill="var(--symbol-color)"
    stroke="var(--symbol-dark)"
    stroke-width="1.5"
    stroke-linejoin="round"/>
  <rect x="14" y="26" width="20" height="13" rx="2"
    fill="var(--symbol-color)"
    stroke="var(--symbol-dark)"
    stroke-width="1.5"/>
  <!-- Interior details use transparency, never hardcoded dark colors -->
  <rect x="20" y="31" width="8" height="8" rx="2"
    fill="rgba(0,0,0,0.15)"/>
</svg>
```

The build pipeline replaces `var(--symbol-color)` and `var(--symbol-dark)` with per-symbol hex values from `symbols.json` before applying variant logic.

---

## Symbol Index Format (`symbols.json`)

```json
{
  "symbols": [
    {
      "name": "House",
      "aprs_code": "/-",
      "table": "primary",
      "filename": "house",
      "color": "#e8a030",
      "dark": "#7a4d00",
      "category": "infrastructure",
      "description": "Fixed station / home"
    },
    {
      "name": "Car",
      "aprs_code": "/>",
      "table": "primary",
      "filename": "car",
      "color": "#3a8ef6",
      "dark": "#0a3d8a",
      "category": "vehicles",
      "description": "Mobile station / vehicle"
    }
  ]
}
```

**Fields:**
- `aprs_code` — two-character APRS symbol code (table prefix + symbol character)
- `table` — `"primary"` or `"alternate"`
- `filename` — base filename without extension, used in `src/primary/` or `src/alternate/`
- `color` — primary fill color (hex)
- `dark` — darker variant for strokes (hex); approximately 40–50% darker than `color`
- `category` — grouping for docs and sprite sheet organization
- `description` — short human-readable description

---

## Build Pipeline

### Tech Stack

- **Node.js** — build scripts
- **SVGO** — SVG optimization (`svgo` npm package)
- **resvg-js** — SVG → PNG rasterization (pure JS, no native deps required)
- **sharp** — sprite sheet assembly
- **glob** — file discovery

### Build Commands

```bash
npm run build                        # Full build: SVG → PNG → sprite → iconify → flutter-sync
npm run build:svg                    # Optimized SVGs only
npm run build:png                    # PNGs only (requires SVG pass first)
npm run build:sprite                 # Sprite sheets only (requires PNG pass first)
npm run build:iconify                # Iconify JSON only (requires SVG pass first)
npm run build:flutter                # Flutter asset sync only (requires SVG pass first)
npm run build:variant flat-badge     # Single variant, full pipeline
npm run clean                        # Remove dist/
```

### Build Flow

```
src/**/*.svg
    │
    ▼
apply-variant.js
    │  Reads variant config JSON
    │  Substitutes var(--symbol-color) / var(--symbol-dark) from symbols.json
    │  Prepends badge <rect> if badge.enabled = true
    │
    ▼
optimize.js (SVGO)
    │  Cleans up, removes comments, minimizes
    │
    ▼
dist/svg/<variant>/primary|alternate/<filename>.svg
    │
    ├──► iconify.js
    │       Reads all dist/svg/ outputs
    │       Emits dist/iconify/meridian-aprs.json (Iconify format)
    │
    ├──► flutter-sync.js
    │       Copies dist/svg/<variant>/ → flutter/assets/symbols/<variant>/
    │       Run after SVG step; keeps Flutter package assets in sync
    │
    ▼
rasterize.js (resvg-js)
    │  Renders at 16, 32, 64px
    │
    ▼
dist/png/<variant>/<size>/<filename>.png
    │
    ▼
sprite.js (sharp)
    │  Assembles grid sprite sheet
    │  Generates JSON index with x/y/w/h per APRS code
    │
    ▼
dist/sprite/<variant>-<size>.png + <variant>-<size>.json
```

---

## Iconify JSON Output Format

Iconify is a de facto standard for icon metadata that enables compatibility with a broad ecosystem of tools (VS Code extensions, Figma plugins, Astro, UnoCSS, Tailwind, etc.). Emitting this format makes the symbol set usable by any Iconify-compatible consumer with no extra work.

The build emits one Iconify JSON file per variant at `dist/iconify/meridian-aprs-<variant>.json`:

```json
{
  "prefix": "meridian-aprs-flat-badge",
  "info": {
    "name": "Meridian APRS Symbols",
    "author": {
      "name": "Meridian APRS",
      "url": "https://meridianaprs.com"
    },
    "license": {
      "title": "CC BY 4.0",
      "url": "https://creativecommons.org/licenses/by/4.0/"
    }
  },
  "icons": {
    "house": {
      "body": "<polygon points='24,10 39,27 9,27' fill='...' />...",
      "width": 48,
      "height": 48
    },
    "car": {
      "body": "...",
      "width": 48,
      "height": 48
    }
  },
  "aliases": {
    "primary-house": { "parent": "house" },
    "aprs-slash-dash": { "parent": "house" }
  }
}
```

The `body` field contains only the inner SVG content (no `<svg>` wrapper). Icon names use the `filename` from `symbols.json`. Aliases map APRS codes to icon names for consumers who want to look up by protocol code.

---

## Sprite Sheet Index Format

```json
{
  "variant": "flat-badge",
  "size": 32,
  "symbols": {
    "/-": { "x": 0,  "y": 0, "w": 32, "h": 32 },
    "/>": { "x": 32, "y": 0, "w": 32, "h": 32 },
    "/[": { "x": 64, "y": 0, "w": 32, "h": 32 }
  }
}
```

---

## npm Package (`@meridian-aprs/symbols`)

The npm package is published from the repo root. It ships `dist/` as package content (not gitignored for npm — use `.npmignore` to include `dist/` in the published package while keeping it out of git).

**What the package ships:**
- `dist/svg/` — optimized SVGs, all variants
- `dist/png/` — rasterized PNGs at 16/32/64px, all variants
- `dist/sprite/` — sprite sheets + JSON indexes, all variants
- `dist/iconify/` — Iconify-compatible JSON, all variants
- `symbols.json` — master symbol index

**`package.json` fields:**
```json
{
  "name": "@meridian-aprs/symbols",
  "version": "1.0.0",
  "description": "APRS symbol icon set for Meridian APRS and the broader APRS community",
  "license": "CC-BY-4.0",
  "main": "symbols.json",
  "files": [
    "dist/",
    "symbols.json",
    "SYMBOLS.md"
  ],
  "publishConfig": {
    "access": "public"
  }
}
```

**`.npmignore`** — include `dist/` in the published package even though it's gitignored:
```
node_modules/
src/
variants/
build/
flutter/
```

**Publishing:**
```bash
npm run build       # build all outputs first
npm publish         # publishes dist/ + symbols.json to npm
```

Web consumers can then use it as:
```js
import symbols from '@meridian-aprs/symbols';
// or reference files directly:
// node_modules/@meridian-aprs/symbols/dist/svg/flat-badge/primary/house.svg
// node_modules/@meridian-aprs/symbols/dist/sprite/flat-badge-32.png
```

---

## Flutter Package (`meridian_aprs_symbols`)

The Flutter package lives in the `flutter/` subdirectory of this repo and is published separately to pub.dev. It bundles the optimized SVGs as Flutter assets and exposes a simple Dart API.

### Package Structure

```
flutter/
├── lib/
│   └── meridian_aprs_symbols.dart
├── assets/
│   └── symbols/
│       ├── flat-badge/         # populated by npm run build:flutter
│       └── flat-nobadge/
├── pubspec.yaml
└── README.md
```

### `pubspec.yaml`

```yaml
name: meridian_aprs_symbols
description: APRS symbol icon set for Flutter apps. Official symbols for Meridian APRS.
version: 1.0.0
homepage: https://github.com/meridian-aprs/meridian-aprs-symbols

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '>=3.10.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_svg: ^2.0.0

flutter:
  assets:
    - packages/meridian_aprs_symbols/assets/symbols/flat-badge/
    - packages/meridian_aprs_symbols/assets/symbols/flat-nobadge/
```

### Dart API (`meridian_aprs_symbols.dart`)

```dart
library meridian_aprs_symbols;

import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';

enum AprsSymbolVariant { flatBadge, flatNoBadge }

class AprsSymbols {
  static const String _packageName = 'meridian_aprs_symbols';

  // Map of APRS two-character codes to filenames
  static const Map<String, String> _index = {
    '/-': 'house',
    '/>': 'car',
    '/[': 'person',
    '/#': 'digipeater',
    '/_': 'weather',
    '/W': 'winlink',
    // ... full set added as symbols are created
  };

  /// Returns the asset path for a given APRS symbol code and variant.
  static String? path(
    String aprsCode, {
    AprsSymbolVariant variant = AprsSymbolVariant.flatBadge,
  }) {
    final filename = _index[aprsCode];
    if (filename == null) return null;
    final variantDir = variant == AprsSymbolVariant.flatBadge
        ? 'flat-badge'
        : 'flat-nobadge';
    return 'packages/$_packageName/assets/symbols/$variantDir/$filename.svg';
  }

  /// Returns an SvgPicture widget for a given APRS symbol code.
  static Widget widget(
    String aprsCode, {
    AprsSymbolVariant variant = AprsSymbolVariant.flatBadge,
    double size = 32,
    Widget? placeholder,
  }) {
    final assetPath = path(aprsCode, variant: variant);
    if (assetPath == null) return placeholder ?? const SizedBox.shrink();
    return SvgPicture.asset(
      assetPath,
      width: size,
      height: size,
      package: _packageName,
    );
  }
}
```

### Meridian Integration

In the Meridian APRS `pubspec.yaml`:
```yaml
dependencies:
  meridian_aprs_symbols: ^1.0.0
```

Usage in Meridian:
```dart
import 'package:meridian_aprs_symbols/meridian_aprs_symbols.dart';

// Widget (most common use)
AprsSymbols.widget('/-', size: 32)

// Badge off (user preference)
AprsSymbols.widget('/-', variant: AprsSymbolVariant.flatNoBadge, size: 32)

// Raw asset path (for custom rendering)
AprsSymbols.path('/-')
```

Updating symbols in Meridian after a new icon set release:
```bash
# In meridian-aprs repo
flutter pub upgrade meridian_aprs_symbols
flutter pub get
```

That's the entire update cycle — no manual file copying ever needed.

### Publishing to pub.dev

```bash
npm run build:flutter   # sync dist/svg/ into flutter/assets/symbols/
cd flutter
dart pub publish        # publishes to pub.dev
```

Both packages (npm and pub.dev) should be versioned in lockstep. When new symbols are added or variants change, bump both to the same version and publish.

---

## Style Guide (Summary — full detail in STYLE_GUIDE.md)

- **Canvas:** 48×48 viewBox, no intrinsic width/height on source SVGs
- **Icon area:** icons fill roughly 70–80% of canvas (~34×34px active area), centered
- **Stroke weight:** 1.5px on `flat-nobadge`; 0 on `flat-badge` (white icon, no stroke needed)
- **Corner radius:** rounded shapes preferred; match visual weight across symbols
- **Colors:** per-symbol, sourced from `symbols.json`. Saturated, distinct — roughly match aprs.fi color energy
- **Dark color:** approximately 40–50% darker than primary; used for strokes and badge border
- **Interior details:** use `rgba(0,0,0,0.15–0.25)` for windows, doors, etc. — never hardcode dark colors
- **No text** in source SVGs
- **No external references** — fully self-contained SVGs only

---

## Implementation Tasks for Claude Code

Work through these in order. Run `npm run build` after each major step to verify the pipeline.

### Task 1 — Repo scaffold

- Initialize Node.js project (`package.json`) with name `@meridian-aprs/symbols`
- Install dependencies: `svgo`, `resvg-js`, `sharp`, `glob`
- Create full directory structure as specified above (including `flutter/` subdirectory)
- Create `.gitignore` (ignore `dist/`, `node_modules/`)
- Create `.npmignore` (exclude `src/`, `variants/`, `build/`, `flutter/`, `node_modules/` — include `dist/`, `symbols.json`, `SYMBOLS.md`)
- Create stub `README.md` with project description, license, and attribution statement

### Task 2 — Symbol index

Create `symbols.json` with the following 6 initial symbols. The full APRS set (~200) will be added in a follow-up session.

| Name | APRS code | Filename | Color | Dark |
|---|---|---|---|---|
| House | `/-` | `house` | `#e8a030` | `#7a4d00` |
| Car | `/>` | `car` | `#3a8ef6` | `#0a3d8a` |
| Person | `/[` | `person` | `#2ecc78` | `#0a6632` |
| Digipeater | `/#` | `digipeater` | `#9b59f5` | `#4a0da0` |
| Weather | `/_` | `weather` | `#22c5e0` | `#006880` |
| Winlink | `/W` | `winlink` | `#e84444` | `#8a0000` |

All are `table: "primary"`. Assign appropriate categories and descriptions.

### Task 3 — Source SVGs

Create `src/primary/<filename>.svg` for each symbol using the parameterized format (`var(--symbol-color)`, `var(--symbol-dark)`). Use the geometry below as reference — these match the approved prototype.

**house.svg** — roof triangle `points="24,10 39,27 9,27"` + body rect `x=14 y=26 w=20 h=13 rx=2` + door rect `x=20 y=31 w=8 h=8 rx=2 fill=rgba(0,0,0,0.15)`

**car.svg** — body rect `x=7 y=25 w=34 h=11 rx=5` + cabin rect `x=12 y=17 w=24 h=10 rx=4` + two window rects `rgba(0,0,0,0.22)` + two wheels (outer circle r=5.5 fill=#111, inner r=2.5 fill=#888) at cx=14,cy=36 and cx=33,cy=36

**person.svg** — head circle `cx=24 cy=16 r=7` + body path `d="M13,39 C13,28 18,24 24,24 C30,24 35,28 35,39 Z"`

**digipeater.svg** — diamond `points="24,8 40,24 24,40 8,24"` + inner arc `d="M18,22 Q24,16 30,22"` stroke=rgba(0,0,0,0.28) sw=2.2 + outer arc `d="M14,17 Q24,9 34,17"` sw=1.6 opacity=0.55 + center dot `cx=24 cy=27 r=3.5`

**weather.svg** — three cloud shapes (`circle cx=19 cy=25 r=8`, `circle cx=30 cy=26 r=6`, `ellipse cx=24 cy=21 rx=10 ry=6`) + four rain drops (ellipses rx=1.5 ry=2.5 at [15,36] [20,38] [25,36] [30,38]) with fill=rgba(0,0,0,0.22)

**winlink.svg** — envelope body rect `x=8 y=18 w=32 h=20 rx=3` + flap polyline `points="8,18 24,30 40,18"` stroke=rgba(0,0,0,0.25) sw=2.2 + radio arc `d="M31,13 Q35,9 39,13"` sw=2.2 + outer arc `d="M28,10 Q35,4 42,10"` sw=1.6 opacity=0.5

### Task 4 — Variant configs

Create `variants/flat-badge.json` and `variants/flat-nobadge.json` using the JSON format specified in the Variant Config Format section above.

### Task 5 — Build pipeline

Implement build scripts in `build/`:

**`apply-variant.js`**
- Accept a source SVG string, variant config, and symbol metadata
- Replace `var(--symbol-color)` and `var(--symbol-dark)` with hex values from symbol metadata
- If `badge.enabled`: prepend a `<rect>` badge element before icon content using badge config values
- Return modified SVG string

**`optimize.js`**
- Accept an SVG string
- Run SVGO with sensible defaults (preserve viewBox, remove comments, minimize)
- Return optimized SVG string

**`rasterize.js`**
- Accept an SVG string, output path, and target size (16, 32, 64)
- Use `resvg-js` to render PNG buffer at target size
- Write PNG to `dist/png/<variant>/<size>/<filename>.png`

**`sprite.js`**
- Glob all PNGs for a given variant + size from `dist/png/<variant>/<size>/`
- Assemble into a sprite sheet using `sharp`
- Write `dist/sprite/<variant>-<size>.png`
- Write `dist/sprite/<variant>-<size>.json` index with x/y/w/h per APRS code

**`iconify.js`**
- Read all optimized SVGs from `dist/svg/` for a given variant
- Strip the `<svg>` wrapper, keeping only inner body content
- Emit `dist/iconify/meridian-aprs-<variant>.json` in Iconify format (see Iconify JSON Output Format section)
- Include aliases mapping APRS codes to icon names

**`flutter-sync.js`**
- Copy `dist/svg/<variant>/` → `flutter/assets/symbols/<variant>/` for all variants
- Flatten primary/alternate subdirectories into a single directory per variant (Flutter asset paths are simpler without subdirs)
- Log files copied

**`build.js`**
- Orchestrate the full pipeline: apply-variant → optimize → rasterize → sprite → iconify → flutter-sync
- Support `--variant <name>` flag to build a single variant
- Support `--svg-only`, `--png-only`, `--sprite-only`, `--iconify-only`, `--flutter-only` flags
- Log progress per symbol and variant

### Task 6 — npm scripts

```json
"scripts": {
  "build": "node build/build.js",
  "build:svg": "node build/build.js --svg-only",
  "build:png": "node build/build.js --png-only",
  "build:sprite": "node build/build.js --sprite-only",
  "build:iconify": "node build/build.js --iconify-only",
  "build:flutter": "node build/build.js --flutter-only",
  "build:variant": "node build/build.js --variant",
  "clean": "rm -rf dist"
}
```

### Task 7 — Flutter package

In `flutter/`:
- Create `pubspec.yaml` as specified in the Flutter Package section above
- Create `lib/meridian_aprs_symbols.dart` with the `AprsSymbols` class as specified
- Populate `_index` map with all 6 initial symbols
- Create `assets/symbols/flat-badge/` and `assets/symbols/flat-nobadge/` directories (will be populated by `flutter-sync.js`)
- Create `flutter/README.md` explaining pub.dev installation and basic usage

### Task 8 — Docs

- Write `SYMBOLS.md` — table of all symbols with APRS code, name, category, filename
- Write `STYLE_GUIDE.md` — visual rules for contributors (expand from Style Guide Summary above)
- Write final `README.md` — project description, ecosystem overview (npm + pub.dev + Iconify), build instructions, variant overview, license, attribution

### Task 9 — Verification

- Run `npm run build` — confirm 6 symbols × 2 variants produce correct output at all stages
- Confirm 36 PNGs produced (6 symbols × 2 variants × 3 sizes)
- Verify sprite sheet JSON indexes have correct x/y/w/h values
- Open `dist/svg/flat-badge/*.svg` in browser — confirm badge renders with color
- Open `dist/svg/flat-nobadge/*.svg` in browser — confirm transparent background, colored icon
- Grep `dist/svg/**/*.svg` for `var(--symbol` — must return zero matches
- Verify `dist/iconify/meridian-aprs-flat-badge.json` is valid JSON and contains all 6 icons
- Verify `flutter/assets/symbols/flat-badge/` and `flat-nobadge/` are populated after build

---

## Notes for Claude Code

- Run in **plan mode first** before writing any files. Confirm directory structure and pipeline design, then proceed.
- The 6 initial symbols are a scaffold. The full APRS set (~200 symbols) will be added in a follow-up session. Design the pipeline to handle scale from day one.
- The variant system (JSON configs + pipeline) must be extensible — adding a new variant in the future should require only a new JSON file in `variants/`, no pipeline changes.
- Keep build scripts simple and readable. This repo will receive community contributions.
- Do not commit anything to `dist/` — it is build output only. The `flutter/assets/symbols/` directory is an exception — it is committed as part of the Flutter package and populated by the build pipeline.
- `flat-badge` is the primary Meridian variant. Treat it as the reference when verifying output quality.
- Both the npm package and pub.dev package should be versioned in lockstep. Document the release process clearly in `README.md`.