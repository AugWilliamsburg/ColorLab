import { useMemo, useState } from "react";
import { interpolateColors, toCssLinearGradient, type InterpolationMode } from "../utils/gradient";
import { isValidHex } from "../utils/color";

const DIRECTIONS = [
  { value: "to right", label: "→ Right" },
  { value: "to left", label: "← Left" },
  { value: "to top", label: "↑ Top" },
  { value: "to bottom", label: "↓ Bottom" },
  { value: "to bottom right", label: "↘ Bottom right" },
  { value: "to bottom left", label: "↙ Bottom left" },
  { value: "45deg", label: "45°" },
  { value: "135deg", label: "135°" },
] as const;

export default function GradientGenerator() {
  const [startHex, setStartHex] = useState("#6366f1");
  const [endHex, setEndHex] = useState("#ec4899");
  const [steps, setSteps] = useState(8);
  const [mode, setMode] = useState<InterpolationMode>("hsl");
  const [direction, setDirection] = useState<string>("to right");
  const [copied, setCopied] = useState(false);

  const validInputs = isValidHex(startHex) && isValidHex(endHex);

  const stops = useMemo(() => {
    if (!validInputs) return [];
    return interpolateColors(startHex, endHex, steps, mode);
  }, [startHex, endHex, steps, mode, validInputs]);

  const cssGradient = useMemo(() => {
    if (stops.length === 0) return "";
    return toCssLinearGradient(stops, direction as never);
  }, [stops, direction]);

  const cssSnippet = `background: ${cssGradient};`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <section className="panel">
      <h2 className="panel__title">Gradient Generator</h2>
      <p className="panel__subtitle">
        Blend two colors in RGB or HSL space and grab the CSS gradient.
      </p>

      <div className="controls">
        <label className="controls__field">
          <span>Start color</span>
          <div className="controls__color-input">
            <input
              type="color"
              value={isValidHex(startHex) ? startHex : "#000000"}
              onChange={(e) => setStartHex(e.target.value)}
            />
            <input type="text" value={startHex} onChange={(e) => setStartHex(e.target.value)} />
          </div>
        </label>

        <label className="controls__field">
          <span>End color</span>
          <div className="controls__color-input">
            <input
              type="color"
              value={isValidHex(endHex) ? endHex : "#000000"}
              onChange={(e) => setEndHex(e.target.value)}
            />
            <input type="text" value={endHex} onChange={(e) => setEndHex(e.target.value)} />
          </div>
        </label>

        <label className="controls__field">
          <span>Steps</span>
          <input
            type="number"
            min={2}
            max={20}
            value={steps}
            onChange={(e) => setSteps(Math.min(20, Math.max(2, Number(e.target.value) || 2)))}
          />
        </label>

        <label className="controls__field">
          <span>Blend mode</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as InterpolationMode)}>
            <option value="hsl">HSL (smoother hue)</option>
            <option value="rgb">RGB (linear)</option>
          </select>
        </label>

        <label className="controls__field">
          <span>Direction</span>
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            {DIRECTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!validInputs && <p className="error-text">Please enter valid hex colors.</p>}

      {validInputs && (
        <>
          <div className="gradient-preview" style={{ background: cssGradient }} />

          <div className="gradient-stops">
            {stops.map((hex, i) => (
              <span key={`${hex}-${i}`} className="gradient-stops__chip" style={{ backgroundColor: hex }} title={hex} />
            ))}
          </div>

          <div className="share-row">
            <input type="text" readOnly value={cssSnippet} className="share-row__input" />
            <button className="btn btn--secondary" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy CSS"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
