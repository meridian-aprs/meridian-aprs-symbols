'use strict';

const { optimize } = require('svgo');

/**
 * optimize.js
 *
 * Pure function — no I/O. Runs SVGO on an SVG string with sensible defaults.
 * Preserves viewBox. Does not strip comments that are structural.
 *
 * @param {string} svgString - SVG source string to optimize
 * @returns {string}         - Optimized SVG string
 */
function optimizeSvg(svgString) {
  const result = optimize(svgString, {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // Keep clean structure
            cleanupIds: true,
            // Don't inline styles — keep attribute-based styling intact
            inlineStyles: false,
          },
        },
      },
      // removeViewBox is NOT part of preset-default in SVGO v4 — it is disabled
      // by default already, so no explicit config needed. viewBox is preserved.
    ],
  });

  return result.data;
}

module.exports = { optimizeSvg };
