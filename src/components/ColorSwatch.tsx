import { useState } from "react";
import { bestTextColor, hexToRgb, hexToHsl } from "../utils/color";

interface ColorSwatchProps {
  hex: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function ColorSwatch({ hex, label, size = "md" }: ColorSwatchProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);
  const textColor = bestTextColor(hex);

  const rgbStr = `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
  const hslStr = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;

  const heightClass = size === "sm" ? "h-16" : size === "lg" ? "h-40" : "h-28";

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // clipboard may be unavailable; ignore silently
    }
  };

  return (
    <div className="swatch">
      <div
        className={`swatch__color ${heightClass}`}
        style={{ backgroundColor: hex, color: textColor }}
      >
        {label && <span className="swatch__label">{label}</span>}
      </div>
      <div className="swatch__meta">
        <button className="swatch__code" onClick={() => copy(hex.toUpperCase())}>
          {copied === hex.toUpperCase() ? "Copied!" : hex.toUpperCase()}
        </button>
        <button className="swatch__code swatch__code--secondary" onClick={() => copy(rgbStr)}>
          {copied === rgbStr ? "Copied!" : rgbStr}
        </button>
        <button className="swatch__code swatch__code--secondary" onClick={() => copy(hslStr)}>
          {copied === hslStr ? "Copied!" : hslStr}
        </button>
      </div>
    </div>
  );
}
