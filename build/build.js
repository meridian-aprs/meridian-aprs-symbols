'use strict';

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { applyVariant } = require('./apply-variant');
const { optimizeSvg } = require('./optimize');
const { rasterize, SIZES } = require('./rasterize');
const { buildSprite } = require('./sprite');
const { buildIconify } = require('./iconify');
const { flutterSync } = require('./flutter-sync');

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function hasFlag(flag) {
  return args.includes(flag);
}

function flagValue(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
}

const SVG_ONLY     = hasFlag('--svg-only');
const PNG_ONLY     = hasFlag('--png-only');
const SPRITE_ONLY  = hasFlag('--sprite-only');
const ICONIFY_ONLY = hasFlag('--iconify-only');
const FLUTTER_ONLY = hasFlag('--flutter-only');
const FORCE        = hasFlag('--force');
const VARIANT_FILTER = flagValue('--variant');

// Determine which stages to run
const runSvg = !PNG_ONLY && !SPRITE_ONLY && !ICONIFY_ONLY && !FLUTTER_ONLY;
const runPng = !SVG_ONLY && !SPRITE_ONLY && !ICONIFY_ONLY && !FLUTTER_ONLY;
const runSprite = !SVG_ONLY && !PNG_ONLY && !ICONIFY_ONLY && !FLUTTER_ONLY;
const runIconify = !SVG_ONLY && !PNG_ONLY && !SPRITE_ONLY && !FLUTTER_ONLY;
const runFlutter = !SVG_ONLY && !PNG_ONLY && !SPRITE_ONLY && !ICONIFY_ONLY;

// ---------------------------------------------------------------------------
// Load symbol index and variant configs
// ---------------------------------------------------------------------------

const symbolsPath = path.join(process.cwd(), 'symbols.json');
const { symbols } = JSON.parse(fs.readFileSync(symbolsPath, 'utf8'));

async function loadVariants() {
  const variantFiles = await glob('variants/*.json');
  return variantFiles.map((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
}

// ---------------------------------------------------------------------------
// SVG stage: apply variant + optimize → dist/svg/
// ---------------------------------------------------------------------------

async function runSvgStage(variants) {
  console.log('\n== SVG stage ==');
  for (const variant of variants) {
    console.log(`\n[${variant.name}]`);
    for (const sym of symbols) {
      const srcPath = path.join('src', sym.table, `${sym.filename}.svg`);
      if (!fs.existsSync(srcPath)) {
        console.warn(`  WARN: source SVG not found: ${srcPath}`);
        continue;
      }

      const source = fs.readFileSync(srcPath, 'utf8');
      const transformed = applyVariant(source, variant, sym);
      const optimized = optimizeSvg(transformed);

      const outDir = path.join('dist', 'svg', variant.name, sym.table);
      fs.mkdirSync(outDir, { recursive: true });

      const outPath = path.join(outDir, `${sym.filename}.svg`);
      if (!FORCE && fs.existsSync(outPath)) {
        console.log(`  ${sym.filename} (${sym.table}) — svg skipped`);
        continue;
      }
      fs.writeFileSync(outPath, optimized);
      console.log(`  ${sym.filename} (${sym.table}) — svg ✓`);
    }
  }
}

// ---------------------------------------------------------------------------
// PNG stage: rasterize → dist/png/
// ---------------------------------------------------------------------------

async function runPngStage(variants) {
  console.log('\n== PNG stage ==');
  for (const variant of variants) {
    console.log(`\n[${variant.name}]`);
    for (const sym of symbols) {
      const svgPath = path.join('dist', 'svg', variant.name, sym.table, `${sym.filename}.svg`);
      if (!fs.existsSync(svgPath)) {
        console.warn(`  WARN: optimized SVG not found: ${svgPath} — run SVG stage first`);
        continue;
      }

      if (!FORCE && SIZES.every(size => {
        const p = path.join('dist', 'png', variant.name, String(size), sym.table, `${sym.filename}.png`);
        return fs.existsSync(p);
      })) {
        console.log(`  ${sym.filename} — png skipped`);
        continue;
      }
      const svgString = fs.readFileSync(svgPath, 'utf8');
      rasterize(svgString, variant.name, sym.table, sym.filename);
      console.log(`  ${sym.filename} — png @ ${SIZES.join('/')}px ✓`);
    }
  }
}

// ---------------------------------------------------------------------------
// Sprite stage: assemble sprite sheets
// ---------------------------------------------------------------------------

async function runSpriteStage(variants) {
  console.log('\n== Sprite stage ==');
  for (const variant of variants) {
    console.log(`\n[${variant.name}]`);
    for (const size of SIZES) {
      await buildSprite(variant.name, size, symbols);
    }
  }
}

// ---------------------------------------------------------------------------
// Iconify stage
// ---------------------------------------------------------------------------

async function runIconifyStage(variants) {
  console.log('\n== Iconify stage ==');
  for (const variant of variants) {
    console.log(`\n[${variant.name}]`);
    buildIconify(variant.name, symbols);
  }
}

// ---------------------------------------------------------------------------
// Flutter sync stage
// ---------------------------------------------------------------------------

async function runFlutterStage(variants) {
  console.log('\n== Flutter sync stage ==');
  for (const variant of variants) {
    console.log(`\n[${variant.name}]`);
    await flutterSync(variant.name);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  let variants = await loadVariants();

  if (VARIANT_FILTER) {
    variants = variants.filter((v) => v.name === VARIANT_FILTER);
    if (variants.length === 0) {
      console.error(`ERROR: No variant found with name "${VARIANT_FILTER}"`);
      process.exit(1);
    }
  }

  console.log(`Building ${variants.map((v) => v.name).join(', ')} — ${symbols.length} symbols`);

  if (runSvg) await runSvgStage(variants);
  if (runPng) await runPngStage(variants);
  if (runSprite) await runSpriteStage(variants);
  if (runIconify) await runIconifyStage(variants);
  if (runFlutter) await runFlutterStage(variants);

  console.log('\n== Build complete ==\n');
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
