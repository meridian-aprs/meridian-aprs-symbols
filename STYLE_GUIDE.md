# Style Guide — meridian-aprs-symbols

This guide defines the visual and technical rules for contributing new symbols to `meridian-aprs-symbols`. Follow these rules exactly so new symbols integrate consistently with existing ones and render correctly across all build variants and sizes.

---

## Canvas

- **ViewBox:** `0 0 48 48` — all source SVGs use a 48×48 coordinate space.
- **No intrinsic width/height:** Do not add `width` or `height` attributes to the `<svg>` element. The build pipeline and consumers set render size.
- **Background:** transparent — no background rect in source SVGs. The badge variant adds its own background.

## Icon Area

- **Active area:** icons should fill roughly **70–80% of the canvas** — approximately a 34×34px active area, centered.
- Leave some breathing room at the edges. Icons that bleed to the canvas edge will look cramped in the badge variant.
- Optical centering is preferred over mathematical centering for asymmetric shapes.

## Color Token Quick Reference

Use this table to pick the right token for every element. Wrong token choices are the most common source of rendering bugs across variants.

| Element type | `fill` | `stroke` |
|---|---|---|
| Structural body (roof, cabin, body rect) | `var(--symbol-color)` | `var(--symbol-dark)` |
| Interior details (windows, doors, drops, flap) | `var(--detail-color)` | `var(--detail-color)` |
| Signal / radio arcs | `none` | `var(--detail-color)` |
| Absolute-dark element on a light base (tire) | `rgba(0,0,0,0.85)` | — |
| Light element on a dark base (wheel hub) | `rgba(255,255,255,0.45)` | — |

**Never use hex colors** (`#111`, `#888`, etc.) for any element. The build pipeline cannot distinguish hardcoded hex from structural fills and will recolor them all to white in badge mode.

## Colors

- Use the CSS custom properties from the table above for all element coloring.
- `var(--symbol-color)` — primary fill color, defined per symbol in `symbols.json`
- `var(--symbol-dark)` — 40–50% darker than primary; used for structural outlines only
- `var(--detail-color)` — adaptive detail color; the build pipeline resolves it per variant:
  - `flat-badge`: `rgba(0,0,0,0.2)` — slight darkening on white icon, tints toward badge color
  - `flat-nobadge`: `rgba(0,0,0,0.25)` — darkens detail against the colored icon
  - `flat-nobadge-dark`: `rgba(255,255,255,0.35)` — lightens detail against the colored icon on dark tiles
- Per-symbol colors are defined in `symbols.json`. Choose saturated, distinct colors with energy roughly matching aprs.fi's color palette.
- `dark` should be visually readable as a border/stroke on the `color` background.

## Interior Details

Interior details (windows, doors, envelope flaps, rain drops, signal indicators) must render visibly across all three no-badge variants as well as flat-badge. Use one of two approaches:

### Standard details — use `var(--detail-color)`

For any detail that needs to adapt to both light and dark backgrounds, use the `var(--detail-color)` placeholder:

```svg
<rect x="20" y="31" width="8" height="8" rx="2" fill="var(--detail-color)"/>
```

The build pipeline resolves this to the correct transparency for each variant (see Colors section above). **If you hardcode `rgba(0,0,0,X)` instead, that value is preserved as-is and will be invisible in `flat-nobadge-dark`.**

### Absolute-dark elements — use `rgba(0,0,0,X)` directly

Some elements must be very dark regardless of background — for example, wheel tires, which always sit on the car body (a light or white surface) and should always read as near-black. Author these with a literal `rgba(0,0,0,X)` value:

```svg
<!-- Tire: always near-black, sits on white/light car body -->
<circle cx="14" cy="36" r="5.5" fill="rgba(0,0,0,0.85)"/>
<!-- Hub: semi-transparent white composites to medium gray over the dark tire -->
<circle cx="14" cy="36" r="2.5" fill="rgba(255,255,255,0.45)"/>
```

The hub uses `rgba(255,255,255,X)` — not `rgba(0,0,0,X)` — because it sits on top of the dark tire. A dark transparency over an already-dark element produces no visible contrast. Semi-transparent white over the dark tire composites to a readable medium gray (~rgb(136,136,136)).

### Minimum detail size

At 16px output with a 48-unit viewbox, 1 SVG unit = 0.33px. **Details smaller than ~5 units will be subpixel at 16px and may disappear entirely.** Always verify detail visibility at 16px in `preview.html` before finalizing a symbol. Prefer slightly larger, simpler detail shapes over small, precise ones.

## Stroke Weight

- **flat-nobadge:** structural elements use `stroke-width="1.5"` with `stroke="var(--symbol-dark)"`.
- **flat-badge:** structural strokes are removed by the build pipeline — the white icon on a colored badge reads clearly without them.
- Detail strokes (arc lines, envelope flap) use `stroke="var(--detail-color)"` so they survive badge recoloring as adaptive semi-transparent strokes.
- Reduced opacity (`opacity="0.5"`) on outer/secondary arcs suggests range falloff without requiring a separate color value.

## Shapes and Geometry

- **Rounded corners** are preferred for body shapes — use `rx` on rects. Match the visual weight of `rx` across similar symbol types.
- Use `polygon` for multi-point flat shapes (rooftops, diamonds, arrows).
- Use `path` for complex organic outlines (person body, antenna shapes).
- Use `circle` and `ellipse` for round elements.
- Avoid bezier complexity unless necessary — simpler paths render more cleanly at small sizes (16px).

## Signal / Radio Arcs

- Two arcs (inner + outer) represent signal transmission (used in digipeater, winlink, etc.).
- Inner arc: `stroke-width="2.2"`, `stroke="var(--detail-color)"`.
- Outer arc: `stroke-width="1.6"`, `stroke="var(--detail-color)"`, `opacity="0.5"` to suggest range falloff.
- Both arcs: `fill="none"`, `stroke-linecap="round"`.
- Position arcs in the upper portion of the canvas, clear of the main icon body.
- **Do not use `var(--symbol-dark)` for signal arcs.** It resolves to a hex color, which the build pipeline sets to `stroke="none"` during badge recoloring.

## Common Pitfalls

These mistakes each produce a symbol that looks correct in one variant but broken in another. Check for all of them before opening a PR.

**1. Hex color anywhere in the SVG**
The badge recoloring pass converts every hex fill to white and every hex stroke to `none`. A `fill="#111"` tire becomes an invisible white circle on the badge. Use `rgba(0,0,0,0.85)` instead.

**2. `var(--symbol-dark)` on a detail stroke**
`var(--symbol-dark)` resolves to a hex color (e.g. `#1a3a6e`). The stroke recoloring pass then sets it to `none`. Signal arcs, envelope flaps, and any other decorative strokes must use `var(--detail-color)`.

**3. Hardcoded `rgba(0,0,0,X)` for adaptive details**
`rgba(0,0,0,X)` is preserved as-is by the pipeline. It looks fine on `flat-nobadge` (light background) but is invisible against a dark tile in `flat-nobadge-dark`. Any detail that needs to work on both light and dark backgrounds must use `var(--detail-color)`.

**4. Dark overlay on a dark base**
`rgba(0,0,0,0.25)` over a near-black tire (`rgba(0,0,0,0.85)`) composites to ~rgb(29,29,29) — indistinguishable from the tire. Elements that sit on top of a dark base need a light color: `rgba(255,255,255,0.45)`.

**5. Details too small for 16px**
At 16px, 1 SVG unit is 0.33px. An ellipse with `rx="1.5"` is ~1px wide and may not render at all. Verify every symbol at 16px in `preview.html`.

## Text

- **No text in source SVGs.** Letter/numeral identifiers belong in the symbol description and APRS code, not in the graphic.

## External References

- Source SVGs must be **fully self-contained** — no `<use>`, `<image>`, external `href`, or font references.

## Naming

- Filename is the symbol's lowercase English name, no spaces: `digipeater`, `weather`, `winlink`.
- Use hyphens for multi-word names: `weather-station` (if needed).
- Register the filename, APRS code, colors, category, and description in `symbols.json` before adding the SVG.

## Checklist for New Symbols

- [ ] `symbols.json` entry added with `name`, `aprs_code`, `table`, `filename`, `color`, `dark`, `category`, `description`
- [ ] Source SVG at `src/<table>/<filename>.svg`
- [ ] ViewBox is `0 0 48 48`, no width/height on `<svg>`
- [ ] Structural fills use `var(--symbol-color)`, structural strokes use `var(--symbol-dark)`
- [ ] Interior details use `var(--detail-color)` — not hardcoded `rgba(0,0,0,X)` or hex
- [ ] Signal/radio arcs use `stroke="var(--detail-color)"` — not `var(--symbol-dark)`
- [ ] Absolute-dark elements (tires, etc.) use `rgba(0,0,0,X)`; elements on top of those use `rgba(255,255,255,X)`
- [ ] No hex colors anywhere in the SVG
- [ ] All detail elements are ≥5 SVG units in their smallest dimension
- [ ] Icon fills 70–80% of canvas, centered
- [ ] No text, no external references
- [ ] `npm run build` passes with zero warnings
- [ ] All three no-badge variants reviewed at 16px in `preview.html` — details visible on light tiles (flat-nobadge) and dark tiles (flat-nobadge-dark)
- [ ] `flat-badge` reviewed at 32px — white icon on colored badge, interior details visible
