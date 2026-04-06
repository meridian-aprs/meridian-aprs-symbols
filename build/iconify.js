'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Sanitize an APRS code into a safe icon alias string.
 * / → slash, \ → backslash, # → hash, > → gt, [ → lbracket, _ → underscore, W → W
 */
function sanitizeCode(code) {
  return code
    .replace(/\//g, 'slash')
    .replace(/\\/g, 'backslash')
    .replace(/#/g, 'hash')
    .replace(/>/g, 'gt')
    .replace(/\[/g, 'lbracket')
    .replace(/_/g, 'underscore')
    .replace(/\|/g, 'pipe')
    .replace(/\*/g, 'star')
    .replace(/\^/g, 'caret')
    .replace(/!/g, 'excl')
    .replace(/"/g, 'dquote')
    .replace(/&/g, 'amp')
    .replace(/'/g, 'squote')
    .replace(/\./g, 'dot')
    .replace(/,/g, 'comma')
    .replace(/\s+/g, '-');
}

/**
 * iconify.js
 *
 * Reads all optimized SVGs from dist/svg/<variant>/ and assembles an
 * Iconify-compatible JSON file at dist/iconify/meridian-aprs-<variant>.json.
 *
 * @param {string} variant   - Variant name (e.g. 'flat-badge')
 * @param {object[]} symbols - Symbol list from symbols.json
 */
function buildIconify(variant, symbols) {
  const icons = {};
  const aliases = {};

  for (const sym of symbols) {
    const svgPath = path.join('dist', 'svg', variant, sym.table, `${sym.filename}.svg`);
    if (!fs.existsSync(svgPath)) {
      console.warn(`  [iconify] Missing SVG: ${svgPath} — skipping`);
      continue;
    }

    const svgContent = fs.readFileSync(svgPath, 'utf8');

    // Strip outer <svg ...> wrapper, keep only inner body
    const body = svgContent
      .replace(/<\?xml[^>]*\?>\s*/g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '')
      .trim();

    icons[sym.filename] = {
      body,
      width: 48,
      height: 48,
    };

    // Alias: table-prefixed name
    aliases[`${sym.table}-${sym.filename}`] = { parent: sym.filename };
    // Alias: aprs code sanitized
    aliases[`aprs-${sanitizeCode(sym.aprs_code)}`] = { parent: sym.filename };
  }

  const output = {
    prefix: `meridian-aprs-${variant}`,
    info: {
      name: 'Meridian APRS Symbols',
      author: {
        name: 'Meridian APRS',
        url: 'https://meridianaprs.com',
      },
      license: {
        title: 'CC BY 4.0',
        url: 'https://creativecommons.org/licenses/by/4.0/',
      },
    },
    icons,
    aliases,
  };

  const outDir = path.join('dist', 'iconify');
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, `meridian-aprs-${variant}.json`);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`  [iconify] meridian-aprs-${variant}.json — ${Object.keys(icons).length} icons`);
}

module.exports = { buildIconify };
