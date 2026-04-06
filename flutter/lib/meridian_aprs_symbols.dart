library meridian_aprs_symbols;

import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';

enum AprsSymbolVariant { flatBadge, flatNoBadge }

class AprsSymbols {
  static const String _packageName = 'meridian_aprs_symbols';

  // Map of APRS two-character codes to filenames.
  // Extended as new symbols are added to symbols.json and the build runs.
  static const Map<String, String> _index = {
    '/-': 'house',
    '/>': 'car',
    '/[': 'person',
    '/#': 'digipeater',
    '/_': 'weather',
    '/W': 'winlink',
  };

  /// Returns the asset path for a given APRS symbol code and variant.
  /// Returns null if the symbol code is not in the index.
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
  /// Returns [placeholder] (or SizedBox.shrink) if the code is unknown.
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
