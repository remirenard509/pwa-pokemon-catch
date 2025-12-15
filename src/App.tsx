import React, { useState, useEffect } from "react";
import CaptureSimulator from "./components/CaptureSimulateur";
import CapturedPokemonList from "./components/CapturedPokemonList";
import PokedexView from "./components/PokedexView";
import StatsView from "./components/StatsView";
import ThemeToggle from "./components/ThemeToggle";
import {
  getCapturedPokemon,
  getStats,
  getPokedex,
  getTheme,
  setTheme,
} from "./services/storageService";

type View = "capture" | "team" | "pokedex" | "stats";

function App() {
  const [currentView, setCurrentView] = useState<View>("capture");
  const [capturedPokemon, setCapturedPokemon] = useState(getCapturedPokemon());
  const [stats, setStats] = useState(getStats());
  const [pokedex, setPokedex] = useState(getPokedex());
  const [theme, setThemeState] = useState<"light" | "dark">(getTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const refreshData = () => {
    setCapturedPokemon(getCapturedPokemon());
    setStats(getStats());
    setPokedex(getPokedex());
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  const views = [
    { id: "capture" as const, label: "🎯 Capture", emoji: "🎯" },
    { id: "team" as const, label: "👥 Équipe", emoji: "👥" },
    { id: "pokedex" as const, label: "📖 Pokédex", emoji: "📖" },
    { id: "stats" as const, label: "📊 Stats", emoji: "📊" },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎮 Pokémon Capture Simulator</h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <nav className="app-nav">
        {views.map((view) => (
          <button
            key={view.id}
            className={`nav-button ${currentView === view.id ? "active" : ""}`}
            onClick={() => setCurrentView(view.id)}
          >
            <span className="nav-emoji">{view.emoji}</span>
            <span className="nav-label">{view.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {currentView === "capture" && (
          <CaptureSimulator onCapture={refreshData} />
        )}
        {currentView === "team" && (
          <CapturedPokemonList
            pokemon={capturedPokemon}
            onRelease={refreshData}
          />
        )}
        {currentView === "pokedex" && <PokedexView entries={pokedex} />}
        {currentView === "stats" && <StatsView stats={stats} />}
      </main>
    </div>
  );
}

export default App;
