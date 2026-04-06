# meridian_aprs_symbols

Flutter package providing the official APRS symbol icon set for [Meridian APRS](https://meridianaprs.com) and any Flutter app that needs APRS map symbols.

Symbols are optimized SVGs, served as Flutter assets via `flutter_svg`. Two style variants are included: `flat-badge` (default — white icon on a colored badge) and `flat-nobadge` (colored icon, transparent background).

## Installation

In your `pubspec.yaml`:

```yaml
dependencies:
  meridian_aprs_symbols: ^1.0.0
```

Then run:

```sh
flutter pub get
```

## Usage

```dart
import 'package:meridian_aprs_symbols/meridian_aprs_symbols.dart';

// Widget — most common use
AprsSymbols.widget('/-', size: 32)

// No-badge variant (user preference / dense map)
AprsSymbols.widget('/-', variant: AprsSymbolVariant.flatNoBadge, size: 32)

// Raw asset path (for custom rendering)
AprsSymbols.path('/-')
// → 'packages/meridian_aprs_symbols/assets/symbols/flat-badge/house.svg'
```

## APRS Symbol Codes

| Code | Symbol      |
|------|-------------|
| `/-` | House       |
| `/>` | Car         |
| `/[` | Person      |
| `/#` | Digipeater  |
| `/_` | Weather     |
| `/W` | Winlink     |

The full APRS symbol set (~200 symbols) will be added in a future release.

## Variants

| Variant                      | Description                                               |
|------------------------------|-----------------------------------------------------------|
| `AprsSymbolVariant.flatBadge`   | White icon on solid color rounded-rect badge (default)    |
| `AprsSymbolVariant.flatNoBadge` | Colored icon, transparent background — for dense maps     |

## License

CC BY 4.0 — APRS Symbols by Meridian APRS
