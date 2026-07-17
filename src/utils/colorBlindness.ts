// Color vision deficiency (CVD) simulation.
//
// Uses well-known simplified sRGB transform matrices (as popularized by
// tools such as the Coblis / jsColorblindSimulator projects) to approximate
// how a given color would appear to someone with a color vision deficiency.
// These are approximations intended for quick design checks, not a
// scientifically precise physiological model.

import { hexToRgb, rgbToHex, type RGB } from "./color";

export type CvdType =
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia";

export const CVD_LABELS: Record<CvdType, string> = {
  protanopia: "Protanopia (red-blind)",
  deuteranopia: "Deuteranopia (green-blind)",
  tritanopia: "Tritanopia (blue-blind)",
  achromatopsia: "Achromatopsia (full color blindness)",
};

type Matrix3x3 = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
];

const MATRICES: Record<Exclude<CvdType, "achromatopsia">, Matrix3x3> = {
  protanopia: [
    [0.567, 0.433, 0.0],
    [0.558, 0.442, 0.0],
    [0.0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.433, 0.567],
    [0.0, 0.475, 0.525],
  ],
};

function applyMatrix(rgb: RGB, m: Matrix3x3): RGB {
  return {
    r: rgb.r * m[0][0] + rgb.g * m[0][1] + rgb.b * m[0][2],
    g: rgb.r * m[1][0] + rgb.g * m[1][1] + rgb.b * m[1][2],
    b: rgb.r * m[2][0] + rgb.g * m[2][1] + rgb.b * m[2][2],
  };
}

/** Simulate a single RGB color as seen under the given color vision deficiency. */
export function simulateCvdRgb(rgb: RGB, type: CvdType): RGB {
  if (type === "achromatopsia") {
    const gray = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return { r: gray, g: gray, b: gray };
  }
  return applyMatrix(rgb, MATRICES[type]);
}

/** Simulate a hex color as seen under the given color vision deficiency. */
export function simulateCvdHex(hex: string, type: CvdType): string {
  return rgbToHex(simulateCvdRgb(hexToRgb(hex), type));
}

export const CVD_TYPES: CvdType[] = [
  "protanopia",
  "deuteranopia",
  "tritanopia",
  "achromatopsia",
];
