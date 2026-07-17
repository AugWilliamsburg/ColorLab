// Gradient generation utilities: interpolate between two colors either in
// RGB space (simple linear blend) or HSL space (often nicer for hue
// transitions), and produce CSS gradient strings.

import { hexToHsl, hexToRgb, hslToHex, rgbToHex } from "./color";

export type InterpolationMode = "rgb" | "hsl";
export type GradientDirection =
  | "to right"
  | "to left"
  | "to top"
  | "to bottom"
  | "to bottom right"
  | "to bottom left"
  | "135deg"
  | "45deg";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Interpolate hue along the shortest angular path. */
function lerpHue(a: number, b: number, t: number): number {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (a + diff * t + 360) % 360;
}

export function interpolateColors(
  startHex: string,
  endHex: string,
  steps: number,
  mode: InterpolationMode = "hsl",
): string[] {
  if (steps < 2) return [startHex];

  if (mode === "rgb") {
    const start = hexToRgb(startHex);
    const end = hexToRgb(endHex);
    return Array.from({ length: steps }, (_, i) => {
      const t = i / (steps - 1);
      return rgbToHex({
        r: lerp(start.r, end.r, t),
        g: lerp(start.g, end.g, t),
        b: lerp(start.b, end.b, t),
      });
    });
  }

  const start = hexToHsl(startHex);
  const end = hexToHsl(endHex);
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return hslToHex({
      h: lerpHue(start.h, end.h, t),
      s: lerp(start.s, end.s, t),
      l: lerp(start.l, end.l, t),
    });
  });
}

export function toCssLinearGradient(
  colors: string[],
  direction: GradientDirection = "to right",
): string {
  return `linear-gradient(${direction}, ${colors.join(", ")})`;
}
