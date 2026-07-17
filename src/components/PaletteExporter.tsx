import { useMemo, useState } from "react";
import {
  buildShareUrl,
  downloadTextFile,
  exportPalette,
  filenameForFormat,
  type ExportFormat,
} from "../utils/exportPalette";

interface PaletteExporterProps {
  palette: string[];
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: "css", label: "CSS variables" },
  { value: "scss", label: "SCSS variables" },
  { value: "tailwind", label: "Tailwind config" },
  { value: "json", label: "JSON" },
];

export default function PaletteExporter({ palette }: PaletteExporterProps) {
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const exported = useMemo(() => exportPalette(palette, format), [palette, format]);
  const shareUrl = useMemo(() => buildShareUrl(palette), [palette]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exported);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const handleShareCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    downloadTextFile(filenameForFormat(format), exported);
  };

  return (
    <section className="panel">
      <h2 className="panel__title">Export &amp; Share</h2>
      <p className="panel__subtitle">
        Export the current palette as code, or share it via a link.
      </p>

      <div className="controls">
        <label className="controls__field">
          <span>Format</span>
          <select value={format} onChange={(e) => setFormat(e.target.value as ExportFormat)}>
            {FORMAT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <button className="btn" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy code"}
        </button>
        <button className="btn btn--secondary" onClick={handleDownload}>
          ⬇ Download
        </button>
      </div>

      <pre className="code-block">
        <code>{exported}</code>
      </pre>

      <div className="share-row">
        <input type="text" readOnly value={shareUrl} className="share-row__input" />
        <button className="btn btn--secondary" onClick={handleShareCopy}>
          {shareCopied ? "Copied!" : "🔗 Copy share link"}
        </button>
      </div>
    </section>
  );
}
