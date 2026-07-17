# 🎨 ColorLab

ColorLab is a small toolbox for designers and developers to work with colors:

- **Palette Generator** — pick a base color and a color-harmony rule
  (complementary, analogous, triadic, split-complementary, tetradic,
  monochromatic) or generate a random palette using golden-ratio hue
  stepping.
- **Export & Share** — export the current palette as CSS variables, SCSS
  variables, a Tailwind config snippet, or JSON (copy or download), and
  copy a shareable link that encodes the palette in the URL.
- **Color Vision Deficiency Preview** — see how the current palette would
  look for protanopia, deuteranopia, tritanopia, and full color blindness
  (achromatopsia), using standard sRGB simulation matrices.
- **Gradient Generator** — blend two colors in RGB or HSL space, pick the
  number of steps and direction, preview the gradient live, and copy the
  CSS.
- **Contrast Checker** — compute the WCAG 2.x contrast ratio between a text
  color and a background color, and see whether it passes AA / AAA for
  normal and large text.
- **Image Color Extractor** — upload or drag-and-drop an image and extract
  its dominant colors via a lightweight k-means clustering pass over the
  pixel data (all done client-side with Canvas, no server upload). The
  extracted palette can be sent straight to the Palette Generator section.

Every generated swatch can be copied as HEX, RGB, or HSL with a single
click.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server & build
- No external color libraries — all color math (HEX/RGB/HSL conversion,
  relative luminance, contrast ratio, harmony generation, color vision
  deficiency simulation, gradient interpolation, k-means clustering) is
  implemented from scratch in `src/utils/`.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint       # run oxlint
```

## Sharing a palette

The current palette is encoded into the URL query string (e.g.
`?palette=3b82f6,f63b82,82f63b`). Opening a link with this parameter
restores that exact palette on load — use the "Copy share link" button in
the Export & Share panel to grab one.

## Project structure

```
src/
  components/
    ColorSwatch.tsx             # single color card with copy-to-clipboard
    PaletteGenerator.tsx         # harmony-based & random palette generator
    PaletteExporter.tsx          # CSS/SCSS/Tailwind/JSON export + share link
    ColorBlindnessPreview.tsx    # CVD simulation preview rows
    GradientGenerator.tsx        # two-color gradient builder
    ContrastChecker.tsx          # WCAG contrast ratio checker
    ImageExtractor.tsx           # image upload + dominant-color extraction UI
  utils/
    color.ts                # HEX/RGB/HSL conversion, contrast, harmony
    extractPalette.ts        # canvas sampling + k-means clustering
    exportPalette.ts         # CSS/SCSS/Tailwind/JSON export + URL encode/decode
    colorBlindness.ts        # CVD simulation matrices
    gradient.ts              # RGB/HSL interpolation + CSS gradient strings
  App.tsx
  main.tsx
```

## Roadmap ideas

- Save named palettes to local storage / a palette history list
- Multi-stop gradient editor (more than 2 anchor colors)
- Export gradients alongside palettes
- Palette accessibility score summary (average contrast across pairs)
