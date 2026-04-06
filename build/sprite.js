'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { glob } = require('glob');

/**
 * sprite.js
 *
 * Assembles a sprite sheet from all PNGs for a given variant + size.
 * Layout: single row for ≤20 symbols, grid (ceil(sqrt(n)) cols) for more.
 * Writes <variant>-<size>.png and <variant>-<size>.json to dist/sprite/.
 *
 * @param {string} variant   - Variant name (e.g. 'flat-badge')
 * @param {number} size      - Pixel size (16, 32, or 64)
 * @param {object[]} symbols - Ordered symbol list from symbols.json (for deterministic layout)
 */
async function buildSprite(variant, size, symbols) {
  const pngDir = path.join('dist', 'png', variant, String(size));

  // Collect PNG paths keyed by filename
  const pngFiles = await glob(`${pngDir}/**/*.png`);
  const fileMap = {};
  for (const f of pngFiles) {
    const base = path.basename(f, '.png');
    fileMap[base] = f;
  }

  // Order by symbols.json order for deterministic sprite layout
  const ordered = symbols
    .map((sym) => ({ sym, file: fileMap[sym.filename] }))
    .filter((entry) => entry.file != null);

  if (ordered.length === 0) {
    console.log(`  [sprite] No PNGs found for ${variant} @ ${size}px — skipping`);
    return;
  }

  const n = ordered.length;
  const cols = n <= 20 ? n : Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);

  const sheetWidth = cols * size;
  const sheetHeight = rows * size;

  // Build composite input list
  const composites = ordered.map(({ file }, i) => ({
    input: file,
    left: (i % cols) * size,
    top: Math.floor(i / cols) * size,
  }));

  // Create blank canvas and composite all icons
  const sheetBuffer = await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();

  const outDir = path.join('dist', 'sprite');
  fs.mkdirSync(outDir, { recursive: true });

  const spriteName = `${variant}-${size}`;
  fs.writeFileSync(path.join(outDir, `${spriteName}.png`), sheetBuffer);

  // Build JSON index
  const index = {
    variant,
    size,
    symbols: {},
  };
  ordered.forEach(({ sym }, i) => {
    index.symbols[sym.aprs_code] = {
      x: (i % cols) * size,
      y: Math.floor(i / cols) * size,
      w: size,
      h: size,
    };
  });

  fs.writeFileSync(
    path.join(outDir, `${spriteName}.json`),
    JSON.stringify(index, null, 2)
  );

  console.log(`  [sprite] ${spriteName}.png — ${n} icons (${cols}×${rows})`);
}

module.exports = { buildSprite };
