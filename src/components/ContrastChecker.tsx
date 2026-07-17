import { useMemo, useState } from "react";
import { contrastRatio, isValidHex, wcagLevel } from "../utils/color";

export default function ContrastChecker() {
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#f9fafb");

  const validInputs = isValidHex(foreground) && isValidHex(background);

  const ratio = useMemo(() => {
    if (!validInputs) return 0;
    return contrastRatio(foreground, background);
  }, [foreground, background, validInputs]);

  const normalLevel = validInputs ? wcagLevel(ratio, false) : "Fail";
  const largeLevel = validInputs ? wcagLevel(ratio, true) : "Fail";

  const levelClass = (level: string) =>
    level === "AAA" ? "badge badge--pass" : level === "AA" ? "badge badge--ok" : "badge badge--fail";

  return (
    <section className="panel">
      <h2 className="panel__title">Contrast Checker</h2>
      <p className="panel__subtitle">
        Check WCAG 2.x contrast ratio between text and background colors.
      </p>

      <div className="controls">
        <label className="controls__field">
          <span>Text color</span>
          <div className="controls__color-input">
            <input
              type="color"
              value={isValidHex(foreground) ? foreground : "#000000"}
              onChange={(e) => setForeground(e.target.value)}
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
            />
          </div>
        </label>

        <label className="controls__field">
          <span>Background color</span>
          <div className="controls__color-input">
            <input
              type="color"
              value={isValidHex(background) ? background : "#ffffff"}
              onChange={(e) => setBackground(e.target.value)}
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>
        </label>
      </div>

      {!validInputs && <p className="error-text">Please enter valid hex colors.</p>}

      {validInputs && (
        <>
          <div
            className="contrast-preview"
            style={{ backgroundColor: background, color: foreground }}
          >
            <p className="contrast-preview__large">Aa</p>
            <p className="contrast-preview__text">
              The quick brown fox jumps over the lazy dog. Ratio: {ratio.toFixed(2)}:1
            </p>
          </div>

          <div className="contrast-results">
            <div className="contrast-results__item">
              <span>Normal text</span>
              <span className={levelClass(normalLevel)}>{normalLevel}</span>
            </div>
            <div className="contrast-results__item">
              <span>Large text / bold</span>
              <span className={levelClass(largeLevel)}>{largeLevel}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
