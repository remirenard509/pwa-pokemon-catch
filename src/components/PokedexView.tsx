import React, { useState } from 'react';
import type { PokedexEntry } from '../types';

interface Props {
  entries: PokedexEntry[];
}

const PokedexView: React.FC<Props> = ({ entries }) => {
  const [filter, setFilter] = useState<'all' | 'shiny'>('all');
  const [sortBy, setSortBy] = useState<'id' | 'captures' | 'date'>('id');

  const filteredEntries = entries.filter(entry => {
    if (filter === 'shiny') return entry.shinyCount > 0;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case 'id':
        return a.id - b.id;
      case 'captures':
        return b.captureCount - a.captureCount;
      case 'date':
        return b.firstCaptured - a.firstCaptured;
      default:
        return 0;
    }
  });

  if (entries.length === 0) {
    return (
      <div className="pokedex-view">
        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <p>Ton Pokédex est vide</p>
          <p>Capture des Pokémon pour les enregistrer !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pokedex-view">
      <div className="pokedex-header">
        <h2>📖 Pokédex ({entries.length} espèces)</h2>
        
        <div className="pokedex-controls">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous ({entries.length})
            </button>
            <button
              className={`filter-btn ${filter === 'shiny' ? 'active' : ''}`}
              onClick={() => setFilter('shiny')}
            >
              ✨ Shiny ({entries.filter(e => e.shinyCount > 0).length})
            </button>
          </div>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'id' | 'captures' | 'date')}
          >
            <option value="id">Trier par N°</option>
            <option value="captures">Trier par captures</option>
            <option value="date">Trier par date</option>
          </select>
        </div>
      </div>

      <div className="pokedex-grid">
        {sortedEntries.map(entry => (
          <div key={entry.id} className="pokedex-card">
            <div className="pokedex-number">#{entry.id}</div>
            <img src={entry.sprite} alt={entry.name} className="pokedex-sprite" />
            <h3 className="pokedex-name">{entry.name}</h3>
            
            <div className="pokedex-types">
              {entry.types.map(type => (
                <span key={type} className={`type-badge type-${type}`}>
                  {type}
                </span>
              ))}
            </div>

            <div className="pokedex-stats">
              <div className="pokedex-stat">
                <span className="stat-label">Capturés:</span>
                <span className="stat-value">{entry.captureCount}</span>
              </div>
              {entry.shinyCount > 0 && (
                <div className="pokedex-stat shiny">
                  <span className="stat-label">✨ Shiny:</span>
                  <span className="stat-value">{entry.shinyCount}</span>
                </div>
              )}
            </div>

            <div className="first-captured">
              Découvert le {new Date(entry.firstCaptured).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokedexView;
