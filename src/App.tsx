import PaletteGenerator from "./components/PaletteGenerator";
import ContrastChecker from "./components/ContrastChecker";
import ImageExtractor from "./components/ImageExtractor";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>
          <span className="app__logo">🎨</span> ColorLab
        </h1>
        <p>A toolbox for color palette generation, contrast checking, and image color extraction.</p>
      </header>

      <main className="app__main">
        <PaletteGenerator />
        <ContrastChecker />
        <ImageExtractor />
      </main>

      <footer className="app__footer">
        <p>Built with React + TypeScript + Vite.</p>
      </footer>
    </div>
  );
}

export default App;
