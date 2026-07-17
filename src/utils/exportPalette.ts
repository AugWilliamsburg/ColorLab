// Export a palette (array of hex colors) into various common formats.

function slugForIndex(i: number): string {
  return `color-${i + 1}`;
}

export function toCssVariables(palette: string[]): string {
  const lines = palette.map((hex, i) => `  --${slugForIndex(i)}: ${hex};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

export function toScssVariables(palette: string[]): string {
  return palette.map((hex, i) => `$${slugForIndex(i)}: ${hex};`).join("\n");
}

export function toTailwindConfig(palette: string[]): string {
  const entries = palette
    .map((hex, i) => `        ${slugForIndex(i).replace("color-", "colorlab-")}: "${hex}",`)
    .join("\n");
  return `// tailwind.config.js (excerpt)\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      },\n    },\n  },\n};`;
}

export function toJson(palette: string[]): string {
  return JSON.stringify(
    palette.map((hex, i) => ({ name: slugForIndex(i), hex })),
    null,
    2,
  );
}

export type ExportFormat = "css" | "scss" | "tailwind" | "json";

export function exportPalette(palette: string[], format: ExportFormat): string {
  switch (format) {
    case "css":
      return toCssVariables(palette);
    case "scss":
      return toScssVariables(palette);
    case "tailwind":
      return toTailwindConfig(palette);
    case "json":
      return toJson(palette);
    default:
      return "";
  }
}

export function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const EXTENSION_BY_FORMAT: Record<ExportFormat, string> = {
  css: "css",
  scss: "scss",
  tailwind: "js",
  json: "json",
};

export function filenameForFormat(format: ExportFormat): string {
  return `colorlab-palette.${EXTENSION_BY_FORMAT[format]}`;
}

// --- URL sharing -----------------------------------------------------------

const SHARE_PARAM = "palette";

/** Encode a palette into a compact URL query string value (comma-separated hex, no '#'). */
export function encodePaletteForUrl(palette: string[]): string {
  return palette.map((hex) => hex.replace(/^#/, "")).join(",");
}

/** Decode a palette previously produced by encodePaletteForUrl. Invalid entries are dropped. */
export function decodePaletteFromUrl(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(v))
    .map((v) => `#${v}`);
}

export function buildShareUrl(palette: string[]): string {
  const url = new URL(window.location.href);
  url.searchParams.set(SHARE_PARAM, encodePaletteForUrl(palette));
  return url.toString();
}

export function readPaletteFromCurrentUrl(): string[] | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(SHARE_PARAM);
  if (!raw) return null;
  const decoded = decodePaletteFromUrl(raw);
  return decoded.length > 0 ? decoded : null;
}
