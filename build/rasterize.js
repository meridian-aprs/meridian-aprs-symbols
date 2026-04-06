'use strict';

const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const SIZES = [16, 32, 64];

/**
 * rasterize.js
 *
 * Renders an SVG string to PNG at one or more sizes using resvg-js.
 * Writes output to dist/png/<variant>/<size>/<table>/<filename>.png
 *
 * @param {string} svgString  - Optimized SVG string
 * @param {string} variant    - Variant name (e.g. 'flat-badge')
 * @param {string} table      - 'primary' or 'alternate'
 * @param {string} filename   - Base filename without extension
 * @param {number[]} sizes    - Array of pixel sizes to render (default: SIZES)
 */
function rasterize(svgString, variant, table, filename, sizes = SIZES) {
  for (const size of sizes) {
    const resvg = new Resvg(svgString, {
      fitTo: { mode: 'width', value: size },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const outDir = path.join('dist', 'png', variant, String(size), table);
    fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, `${filename}.png`);
    fs.writeFileSync(outPath, pngBuffer);
  }
}

module.exports = { rasterize, SIZES };
