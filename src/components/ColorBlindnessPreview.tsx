import { CVD_LABELS, CVD_TYPES, simulateCvdHex } from "../utils/colorBlindness";

interface ColorBlindnessPreviewProps {
  palette: string[];
}

export default function ColorBlindnessPreview({ palette }: ColorBlindnessPreviewProps) {
  return (
    <section className="panel">
      <h2 className="panel__title">Color Vision Deficiency Preview</h2>
      <p className="panel__subtitle">
        See how the current palette might look for people with different types of color
        vision deficiency (approximate simulation).
      </p>

      <div className="cvd-row cvd-row--label">
        <span className="cvd-row__title">Original</span>
        <div className="cvd-row__swatches">
          {palette.map((hex, i) => (
            <span
              key={`orig-${hex}-${i}`}
              className="cvd-chip"
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
        </div>
      </div>

      {CVD_TYPES.map((type) => (
        <div className="cvd-row" key={type}>
          <span className="cvd-row__title">{CVD_LABELS[type]}</span>
          <div className="cvd-row__swatches">
            {palette.map((hex, i) => {
              const simulated = simulateCvdHex(hex, type);
              return (
                <span
                  key={`${type}-${hex}-${i}`}
                  className="cvd-chip"
                  style={{ backgroundColor: simulated }}
                  title={simulated}
                />
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
