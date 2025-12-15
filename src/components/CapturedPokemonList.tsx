import React from 'react';
import type { CapturedPokemon } from '../types';
import { removeCapturedPokemon } from '../services/storageService';

interface Props {
  pokemon: CapturedPokemon[];
  onRelease: () => void;
}

const CapturedPokemonList: React.FC<Props> = ({ pokemon, onRelease }) => {
  const handleRelease = (captureId: string, name: string, isShiny: boolean) => {
    if (window.confirm(`Libérer ${name}${isShiny ? ' ✨' : ''} ?`)) {
      removeCapturedPokemon(captureId);
      onRelease();
    }
  };

  const getBallEmoji = (ball: string): string => {
    const balls = { poke: '⚪', great: '🔵', ultra: '🟡' };
    return balls[ball as keyof typeof balls] || '⚪';
  };

  if (pokemon.length === 0) {
    return (
      <div className="captured-list empty">
        <div className="empty-state">
          <div className="empty-state-icon">🎒</div>
          <p>Aucun Pokémon capturé</p>
          <p>Commence à capturer des Pokémon !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="captured-list">
      <h2>Mon Équipe ({pokemon.length}/6)</h2>
      <div className="pokemon-grid">
        {pokemon.map(p => (
          <div key={p.captureId} className={`pokemon-card ${p.isShiny ? 'shiny' : ''}`}>
            {p.isShiny && <div className="shiny-indicator">✨</div>}
            
            <img 
              src={p.isShiny ? p.sprites.front_shiny : p.sprites.front_default}
              alt={p.name}
              className="card-sprite"
            />
            
            <h3 className="card-name">{p.name}</h3>
            <p className="card-id">#{p.id}</p>
            
            <div className="card-types">
              {p.types.map(type => (
                <span key={type} className={`type-badge type-${type}`}>
                  {type}
                </span>
              ))}
            </div>

            <div className="card-info">
              <span className="capture-ball">{getBallEmoji(p.ballUsed)}</span>
              <span className="capture-date">
                {new Date(p.capturedAt).toLocaleDateString()}
              </span>
            </div>

            <button
              className="release-button"
              onClick={() => handleRelease(p.captureId, p.name, p.isShiny)}
            >
              💨 Libérer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapturedPokemonList;
