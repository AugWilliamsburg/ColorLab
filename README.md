# 🎨 ColorLab

ColorLab is a small toolbox for designers and developers to work with colors:

- **Palette Generator** — pick a base color and a color-harmony rule
  (complementary, analogous, triadic, split-complementary, tetradic,
  monochromatic) or generate a random palette using golden-ratio hue
  stepping.
- **Contrast Checker** — compute the WCAG 2.x contrast ratio between a text
  color and a background color, and see whether it passes AA / AAA for
  normal and large text.
- **Image Color Extractor** — upload or drag-and-drop an image and extract
  its dominant colors via a lightweight k-means clustering pass over the
  pixel data (all done client-side with Canvas, no server upload).

Every generated swatch can be copied as HEX, RGB, or HSL with a single
click.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server & build
- No external color libraries — all color math (HEX/RGB/HSL conversion,
  relative luminance, contrast ratio, harmony generation, k-means
  clustering) is implemented from scratch in `src/utils/`.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint       # run oxlint
```

## Project structure

```
src/
  components/
    ColorSwatch.tsx        # single color card with copy-to-clipboard
    PaletteGenerator.tsx    # harmony-based & random palette generator
    ContrastChecker.tsx     # WCAG contrast ratio checker
    ImageExtractor.tsx      # image upload + dominant-color extraction UI
  utils/
    color.ts               # HEX/RGB/HSL conversion, contrast, harmony
    extractPalette.ts       # canvas sampling + k-means clustering
  App.tsx
  main.tsx
```

## Roadmap ideas

- Export palettes as CSS variables / Tailwind config / JSON
- Save palettes to local storage / shareable URL
- Color-blindness simulation preview
- Gradient generator between two colors
