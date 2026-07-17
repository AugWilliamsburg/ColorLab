import { useRef, useState } from "react";
import ColorSwatch from "./ColorSwatch";
import { extractPaletteFromImage } from "../utils/extractPalette";

export default function ImageExtractor() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setError(null);
    setLoading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const { hexColors } = await extractPaletteFromImage(file, 6);
      setPalette(hexColors);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract palette.");
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <section className="panel">
      <h2 className="panel__title">Image Color Extractor</h2>
      <p className="panel__subtitle">
        Upload an image to extract its dominant colors as a palette.
      </p>

      <div
        className="dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Uploaded preview" className="dropzone__preview" />
        ) : (
          <p>Click or drag an image here</p>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden-input"
        onChange={onInputChange}
      />

      {loading && <p className="panel__subtitle">Extracting colors…</p>}
      {error && <p className="error-text">{error}</p>}

      {palette.length > 0 && !loading && (
        <div className="palette-grid">
          {palette.map((hex, i) => (
            <ColorSwatch key={`${hex}-${i}`} hex={hex} size="sm" />
          ))}
        </div>
      )}
    </section>
  );
}
