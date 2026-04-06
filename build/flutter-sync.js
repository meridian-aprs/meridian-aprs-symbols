'use strict';

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * flutter-sync.js
 *
 * Copies dist/svg/<variant>/primary/*.svg and alternate/*.svg into
 * flutter/assets/symbols/<variant>/ (flattened — no subdirs).
 * Run after the SVG build step.
 *
 * @param {string} variant - Variant name (e.g. 'flat-badge')
 */
async function flutterSync(variant) {
  const destDir = path.join('flutter', 'assets', 'symbols', variant);
  fs.mkdirSync(destDir, { recursive: true });

  const svgFiles = await glob(`dist/svg/${variant}/**/*.svg`);

  if (svgFiles.length === 0) {
    console.warn(`  [flutter-sync] No SVGs found for variant: ${variant}`);
    return;
  }

  let count = 0;
  for (const src of svgFiles) {
    const filename = path.basename(src);
    const dest = path.join(destDir, filename);
    fs.copyFileSync(src, dest);
    console.log(`  [flutter-sync] ${src} → ${dest}`);
    count++;
  }

  console.log(`  [flutter-sync] ${variant}: ${count} files copied`);
}

module.exports = { flutterSync };
