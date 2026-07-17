import { useState } from "react";
import PaletteGenerator from "./components/PaletteGenerator";
import PaletteExporter from "./components/PaletteExporter";
import ColorBlindnessPreview from "./components/ColorBlindnessPreview";
import ContrastChecker from "./components/ContrastChecker";
import GradientGenerator from "./components/GradientGenerator";
import ImageExtractor from "./components/ImageExtractor";
import { generateHarmony } from "./utils/color";
import { readPaletteFromCurrentUrl } from "./utils/exportPalette";
import "./App.css";

function getInitialPalette(): string[] {
  const shared = readPaletteFromCurrentUrl();
  if (shared) return shared;
  return generateHarmony("#3b82f6", "analogous");
}

function App() {
  const [palette, setPalette] = useState<string[]>(getInitialPalette);

  return (
    <div className="app">
      <header className="app__header">
        <h1>
          <span className="app__logo">🎨</span> ColorLab
        </h1>
        <p>A toolbox for color palette generation, contrast checking, and image color extraction.</p>
      </header>

      <main className="app__main">
        <PaletteGenerator palette={palette} onPaletteChange={setPalette} />
        <PaletteExporter palette={palette} />
        <ColorBlindnessPreview palette={palette} />
        <GradientGenerator />
        <ContrastChecker />
        <ImageExtractor onUsePalette={setPalette} />
      </main>

      <footer className="app__footer">
        <p>Built with React + TypeScript + Vite.</p>
      </footer>
    </div>
  );
}

export default App;
