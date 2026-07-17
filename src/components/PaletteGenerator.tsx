import { useState, useCallback } from "react";
import ColorSwatch from "./ColorSwatch";
import {
  generateHarmony,
  generateRandomPalette,
  isValidHex,
  type HarmonyType,
} from "../utils/color";

const HARMONY_OPTIONS: { value: HarmonyType; label: string }[] = [
  { value: "complementary", label: "Complementary" },
  { value: "analogous", label: "Analogous" },
  { value: "triadic", label: "Triadic" },
  { value: "splitComplementary", label: "Split Complementary" },
  { value: "tetradic", label: "Tetradic" },
  { value: "monochromatic", label: "Monochromatic" },
];

export default function PaletteGenerator() {
  const [baseHex, setBaseHex] = useState("#3b82f6");
  const [harmony, setHarmony] = useState<HarmonyType>("analogous");
  const [palette, setPalette] = useState<string[]>(() =>
    generateHarmony("#3b82f6", "analogous"),
  );
  const [error, setError] = useState<string | null>(null);

  const applyHarmony = useCallback((hex: string, type: HarmonyType) => {
    if (!isValidHex(hex)) {
      setError("Please enter a valid hex color, e.g. #3b82f6");
      return;
    }
    setError(null);
    setPalette(generateHarmony(hex, type));
  }, []);

  const handleBaseChange = (value: string) => {
    setBaseHex(value);
    if (isValidHex(value)) {
      applyHarmony(value, harmony);
    }
  };

  const handleHarmonyChange = (value: HarmonyType) => {
    setHarmony(value);
    applyHarmony(baseHex, value);
  };

  const handleRandom = () => {
    const random = generateRandomPalette(5);
    setPalette(random);
    setBaseHex(random[0]);
    setError(null);
  };

  return (
    <section className="panel">
      <h2 className="panel__title">Palette Generator</h2>
      <p className="panel__subtitle">
        Pick a base color and harmony rule, or generate a fully random palette.
      </p>

      <div className="controls">
        <label className="controls__field">
          <span>Base color</span>
          <div className="controls__color-input">
            <input
              type="color"
              value={isValidHex(baseHex) ? baseHex : "#000000"}
              onChange={(e) => handleBaseChange(e.target.value)}
            />
            <input
              type="text"
              value={baseHex}
              onChange={(e) => handleBaseChange(e.target.value)}
              placeholder="#3b82f6"
            />
          </div>
        </label>

        <label className="controls__field">
          <span>Harmony</span>
          <select
            value={harmony}
            onChange={(e) => handleHarmonyChange(e.target.value as HarmonyType)}
          >
            {HARMONY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <button className="btn btn--secondary" onClick={handleRandom}>
          🎲 Random palette
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="palette-grid">
        {palette.map((hex, i) => (
          <ColorSwatch key={`${hex}-${i}`} hex={hex} />
        ))}
      </div>
    </section>
  );
}
