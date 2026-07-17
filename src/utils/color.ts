// ColorLab core color utilities
// Handles conversion between HEX / RGB / HSL, contrast ratio calculation,
// and color harmony (palette) generation.

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

/** Normalize a hex string to `#rrggbb` lowercase form. */
export function normalizeHex(hex: string): string {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return `#${h.toLowerCase()}`;
}

export function isValidHex(hex: string): boolean {
  try {
    normalizeHex(hex);
    return true;
  } catch {
    return false;
  }
}

export function hexToRgb(hex: string): RGB {
  const normalized = normalizeHex(hex);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return { r, g, b };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const delta = max - min;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

/** Relative luminance per WCAG 2.x definition. */
export function relativeLuminance({ r, g, b }: RGB): number {
  const transform = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rl = transform(r);
  const gl = transform(g);
  const bl = transform(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/** WCAG contrast ratio between two colors (1 - 21). */
export function contrastRatio(hexA: string, hexB: string): number {
  const la = relativeLuminance(hexToRgb(hexA));
  const lb = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagLevel = "Fail" | "AA" | "AAA";

export function wcagLevel(ratio: number, isLargeText = false): WcagLevel {
  if (isLargeText) {
    if (ratio >= 4.5) return "AAA";
    if (ratio >= 3) return "AA";
    return "Fail";
  }
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "Fail";
}

/** Decide whether black or white text is more readable on a given background. */
export function bestTextColor(bgHex: string): "#000000" | "#ffffff" {
  const contrastWithBlack = contrastRatio(bgHex, "#000000");
  const contrastWithWhite = contrastRatio(bgHex, "#ffffff");
  return contrastWithBlack >= contrastWithWhite ? "#000000" : "#ffffff";
}

export type HarmonyType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "splitComplementary"
  | "tetradic"
  | "monochromatic";

/** Generate a color harmony palette from a single base hex color. */
export function generateHarmony(baseHex: string, type: HarmonyType): string[] {
  const base = hexToHsl(baseHex);
  const wrap = (h: number) => ((h % 360) + 360) % 360;

  switch (type) {
    case "complementary":
      return [baseHex, hslToHex({ ...base, h: wrap(base.h + 180) })];
    case "analogous":
      return [
        hslToHex({ ...base, h: wrap(base.h - 30) }),
        baseHex,
        hslToHex({ ...base, h: wrap(base.h + 30) }),
      ];
    case "triadic":
      return [
        baseHex,
        hslToHex({ ...base, h: wrap(base.h + 120) }),
        hslToHex({ ...base, h: wrap(base.h + 240) }),
      ];
    case "splitComplementary":
      return [
        baseHex,
        hslToHex({ ...base, h: wrap(base.h + 150) }),
        hslToHex({ ...base, h: wrap(base.h + 210) }),
      ];
    case "tetradic":
      return [
        baseHex,
        hslToHex({ ...base, h: wrap(base.h + 90) }),
        hslToHex({ ...base, h: wrap(base.h + 180) }),
        hslToHex({ ...base, h: wrap(base.h + 270) }),
      ];
    case "monochromatic":
      return [20, 35, 50, 65, 80].map((l) => hslToHex({ ...base, l }));
    default:
      return [baseHex];
  }
}

/** Generate a fully random pleasant color palette using golden-ratio hue stepping. */
export function generateRandomPalette(count = 5): string[] {
  const goldenRatio = 0.618033988749895;
  let hue = Math.random();
  const palette: string[] = [];
  for (let i = 0; i < count; i++) {
    hue = (hue + goldenRatio) % 1;
    const s = 55 + Math.random() * 30; // 55-85
    const l = 45 + Math.random() * 20; // 45-65
    palette.push(hslToHex({ h: hue * 360, s, l }));
  }
  return palette;
}

/** Simple perceptual distance (Euclidean, in RGB space) used for image color extraction clustering. */
export function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}
