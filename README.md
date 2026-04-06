# meridian-aprs-symbols

A modern, open APRS symbol icon set for the amateur radio community.

Built for [Meridian APRS](https://meridianaprs.com) and designed to be useful for any APRS application — mobile, web, or desktop.

---

## About

APRS (Automatic Packet Reporting System) defines a standard set of symbols used to identify stations, objects, and infrastructure on the map. This project provides a clean, modern SVG icon set covering the full APRS primary and alternate symbol tables, distributed in formats suitable for any platform.

**Design goals:**
- Recognizable — immediately identifiable at small map sizes
- Modern — clean and contemporary without losing the character of the original symbols
- Consistent — unified style guide across all ~200 symbols
- Flexible — multiple variants for different map densities and use cases

---

## Variants

| Variant | Description | Best for |
|---|---|---|
| `flat-badge` | White icon on solid color rounded-rect badge | Default — reads well on any map tile |
| `flat-nobadge` | Colored icon, transparent background | Dense maps where badge overlap is an issue |

Additional variants (shadow, outline, etc.) may be added in future releases. The variant system is designed for easy extension.

---

## Installation

### Flutter / Dart

```yaml
# pubspec.yaml
dependencies:
  meridian_aprs_symbols: ^1.0.0
```

```dart
import 'package:meridian_aprs_symbols/meridian_aprs_symbols.dart';

// Widget
AprsSymbols.widget('/-', size: 32)

// No-badge variant
AprsSymbols.widget('/-', variant: AprsSymbolVariant.flatNoBadge, size: 32)

// Raw asset path
AprsSymbols.path('/-')
```

### JavaScript / npm

```bash
npm install @meridian-aprs/symbols
```

```js
import symbols from '@meridian-aprs/symbols';

// Reference SVG files directly
// node_modules/@meridian-aprs/symbols/dist/svg/flat-badge/house.svg

// Or use the sprite sheet
// node_modules/@meridian-aprs/symbols/dist/sprite/flat-badge-32.png
// node_modules/@meridian-aprs/symbols/dist/sprite/flat-badge-32.json
```

### Iconify

The full symbol set is available as an Iconify-compatible JSON file, usable with any Iconify-compatible tool (VS Code, Figma plugins, UnoCSS, Astro, etc.):

```
dist/iconify/meridian-aprs-flat-badge.json
dist/iconify/meridian-aprs-flat-nobadge.json
```

### Direct download

SVGs, PNGs (16/32/64px), and sprite sheets are available as build artifacts on each [GitHub Release](https://github.com/meridian-aprs/meridian-aprs-symbols/releases).

---

## Symbol Coverage

| Table | Total | Status |
|---|---|---|
| Primary (`/`) | ~95 symbols | 🚧 In progress |
| Alternate (`\`) | ~95 symbols | 🚧 In progress |

See [SYMBOLS.md](SYMBOLS.md) for the full index of available symbols mapped to their APRS two-character codes.

---

## Building from Source

Requires Node.js 18+.

```bash
git clone https://github.com/meridian-aprs/meridian-aprs-symbols.git
cd meridian-aprs-symbols
npm install

npm run build           # Full build — SVG, PNG, sprite sheets, Iconify JSON, Flutter assets
npm run build:svg       # Optimized SVGs only
npm run build:png       # PNGs at 16/32/64px
npm run build:sprite    # Sprite sheets + JSON indexes
npm run build:iconify   # Iconify-compatible JSON
npm run build:flutter   # Sync assets into Flutter package
npm run clean           # Remove dist/
```

Build output lands in `dist/`. See [STYLE_GUIDE.md](STYLE_GUIDE.md) for the source SVG format and contribution conventions.

---

## Contributing

Contributions are welcome — new symbols, corrections, and improvements to existing icons.

Before contributing a new symbol, please read [STYLE_GUIDE.md](STYLE_GUIDE.md). Consistency across the set is the top priority.

**Adding a symbol:**
1. Add the SVG to `src/primary/` or `src/alternate/` following the style guide
2. Add the symbol entry to `symbols.json`
3. Run `npm run build` and verify the output looks correct at 16px, 32px, and 64px
4. Open a pull request

---

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

**Attribution:** APRS Symbols by [Meridian APRS](https://meridianaprs.com)

You are free to use, share, and adapt this icon set for any purpose — including commercial use — as long as you provide attribution.

---

## Related

- [Meridian APRS](https://github.com/meridian-aprs/meridian-aprs) — the open-source APRS client this icon set was built for
- [aprs.org](http://www.aprs.org) — APRS protocol reference and symbol tables
- [aprs.fi](https://aprs.fi) — APRS network map (reference for symbol recognizability)