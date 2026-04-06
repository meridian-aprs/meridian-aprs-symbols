'use strict';

/**
 * apply-variant.js
 *
 * Pure function — no I/O. Transforms a source SVG string by:
 *   1. Substituting var(--symbol-color) and var(--symbol-dark) with hex values
 *   2. Substituting var(--detail-color) with a variant-appropriate transparency:
 *        badge variants  → rgba(255,255,255,0.5)  (light, visible over colored badge)
 *        nobadge variants → rgba(0,0,0,0.25)       (dark, visible over colored icon)
 *   3. For badge variants: recoloring icon fills to white and removing structural strokes
 *      BEFORE injecting the badge, so the badge rect keeps the symbol color.
 *   4. Injecting a badge <rect> before icon content if badge.enabled
 *
 * Detail elements (those using var(--detail-color) or legacy rgba(0,0,0,...) values)
 * are treated separately from structural elements during badge recoloring:
 *   - Their fills/strokes are converted to detailColor (not white/none)
 *   - Their stroke-width, stroke-linecap, stroke-linejoin are preserved so the
 *     rendered detail lines remain at the authored weight. SVGO will clean up these
 *     attributes on structural elements whose stroke is set to "none".
 *
 * @param {string} svgSource  - Raw source SVG string
 * @param {object} variant    - Parsed variant JSON config
 * @param {object} symbol     - Symbol entry from symbols.json
 * @returns {string}          - Modified SVG string
 */
function applyVariant(svgSource, variant, symbol) {
  const color = symbol.color;
  const dark = symbol.dark;

  // Resolve special token values
  function resolve(value) {
    if (value === 'symbol-color') return color;
    if (value === 'symbol-dark') return dark;
    return value;
  }

  // Determine the detail color for this variant.
  //   variant.detailColor (explicit override) → use as-is
  //   badge enabled  → rgba(0,0,0,0.2): cuts through the white icon, tinting toward badge color
  //   no badge, light background → rgba(0,0,0,0.25): darkens detail against colored icon
  //   no badge, dark background  → rgba(255,255,255,0.35): lightens detail against colored icon
  const detailColor = variant.detailColor
    ? variant.detailColor
    : (variant.badge && variant.badge.enabled)
      ? 'rgba(0,0,0,0.2)'
      : 'rgba(0,0,0,0.25)';

  // Step 1: substitute CSS custom properties → all structural fills/strokes are now hex
  let svg = svgSource
    .replace(/var\(--symbol-color\)/g, color)
    .replace(/var\(--symbol-dark\)/g, dark);

  // Step 1b: substitute var(--detail-color) placeholder with the variant-appropriate value.
  // This runs before badge recoloring so detail elements already carry the correct color
  // when the structural recoloring pass inspects attribute values.
  svg = svg.replace(/var\(--detail-color\)/g, detailColor);

  // Step 2: for badge variants, recolor icon elements to white BEFORE injecting badge.
  // This ensures the badge rect (added in step 3) keeps its symbol color.
  if (variant.badge && variant.badge.enabled && variant.icon) {
    const iconFill = resolve(variant.icon.fill);   // e.g. rgba(255,255,255,0.96)
    const iconStrokeWidth = variant.icon.strokeWidth;
    const iconStroke = variant.icon.stroke;

    // Replace fills:
    //   - rgba(255,255,255,...) → preserve as-is
    //   - rgba(0,0,0,...)       → preserve as-is; var(--detail-color) was already resolved to
    //                             rgba(0,0,0,0.2) in step 1b, and literal rgba values (e.g. wheel
    //                             fills) must keep their authored opacity to retain distinct shading
    //   - hex (#...)            → structural fill from var(--symbol-color), recolor to white
    //   - anything else (none, named colors) → preserve
    svg = svg.replace(/fill="([^"]*)"/g, (match, value) => {
      if (value.startsWith('rgba(255,255,255')) return match;   // already correct
      if (value.startsWith('rgba(0,0,0'))      return match;   // detail fill — preserve authored opacity
      if (value.startsWith('#'))               return `fill="${iconFill}"`;  // structural
      return match;
    });

    // Replace strokes:
    //   - rgba(255,255,255,...) → preserve as-is
    //   - rgba(0,0,0,...)       → preserve as-is; resolved from var(--detail-color) in step 1b
    //   - "none"                → leave alone
    //   - anything else (hex, named colors) → structural stroke, remove
    //
    // NOTE: stroke-width / stroke-linecap / stroke-linejoin are intentionally left in
    // place on detail elements so they render at the authored weight. SVGO's
    // removeUselessStrokeAndFill pass will clean up these attributes on any element
    // whose stroke is "none" after this step.
    if (iconStrokeWidth === 0 || iconStroke === 'none') {
      svg = svg.replace(/stroke="([^"]*)"/g, (match, value) => {
        if (value.startsWith('rgba(255,255,255')) return match;   // detail stroke
        if (value.startsWith('rgba(0,0,0'))      return match;   // detail stroke — preserve authored opacity
        if (value === 'none')                    return match;
        return 'stroke="none"';                                   // structural
      });
    }
  }

  // Step 3: inject badge rect immediately after the opening <svg ...> tag.
  // At this point all icon fills are already white (step 2), so the badge fill
  // (symbol color) won't be overwritten by the recoloring pass above.
  if (variant.badge && variant.badge.enabled) {
    const { cornerRadius, strokeWidth } = variant.badge;
    const badgeFill = resolve(variant.badge.fill);     // e.g. #e8a030
    const badgeStroke = resolve(variant.badge.stroke); // e.g. #7a4d00

    const badgeRect =
      `<rect x="1" y="1" width="46" height="46" rx="${cornerRadius}" ` +
      `fill="${badgeFill}" ` +
      `stroke="${badgeStroke}" ` +
      `stroke-width="${strokeWidth}"/>`;

    svg = svg.replace(/(<svg[^>]*>)/, `$1${badgeRect}`);
  }

  return svg;
}

module.exports = { applyVariant };
