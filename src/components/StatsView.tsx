import React from 'react';
import type { GameStats } from '../types';

interface Props {
  stats: GameStats;
}

const StatsView: React.FC<Props> = ({ stats }) => {
  const captureRate = stats.totalEncounters > 0
    ? ((stats.totalCaptures / stats.totalEncounters) * 100).toFixed(1)
    : '0';

  const shinyRate = stats.totalEncounters > 0
    ? (1 / (stats.totalEncounters / stats.shinyEncounters || 1)).toFixed(0)
    : '0';

  const shinyCaptureRate = stats.shinyEncounters > 0
    ? ((stats.shinyCaptured / stats.shinyEncounters) * 100).toFixed(1)
    : '0';

  const totalBalls = stats.ballsUsed.poke + stats.ballsUsed.great + stats.ballsUsed.ultra;

  return (
    <div className="stats-view">
      <h2>📊 Statistiques</h2>

      <div className="stats-grid">
        <div className="stat-card success">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCaptures}</div>
            <div className="stat-label">Captures</div>
            <div className="stat-percent">{captureRate}% de réussite</div>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">💨</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalEscapes}</div>
            <div className="stat-label">Échappements</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalEncounters}</div>
            <div className="stat-label">Rencontres</div>
          </div>
        </div>

        <div className="stat-card shiny">
          <div className="stat-icon">✨</div>
          <div className="stat-content">
            <div className="stat-value">{stats.shinyEncounters}</div>
            <div className="stat-label">Shiny rencontrés</div>
            <div className="stat-percent">1/{shinyRate}</div>
          </div>
        </div>

        <div className="stat-card shiny">
          <div className="stat-icon">🌟</div>
          <div className="stat-content">
            <div className="stat-value">{stats.shinyCaptured}</div>
            <div className="stat-label">Shiny capturés</div>
            <div className="stat-percent">{shinyCaptureRate}%</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">⚪🔵🟡</div>
          <div className="stat-content">
            <div className="stat-value">{totalBalls}</div>
            <div className="stat-label">Balls utilisées</div>
          </div>
        </div>
      </div>

      <div className="stats-details">
        <h3>Détails des Poké Balls</h3>
        <div className="detail-row">
          <span>⚪ Poké Ball</span>
          <span className="detail-value">{stats.ballsUsed.poke}</span>
        </div>
        <div className="detail-row">
          <span>🔵 Super Ball</span>
          <span className="detail-value">{stats.ballsUsed.great}</span>
        </div>
        <div className="detail-row">
          <span>🟡 Hyper Ball</span>
          <span className="detail-value">{stats.ballsUsed.ultra}</span>
        </div>
      </div>

      {stats.shinyEncounters > 0 && (
        <div className="lucky-indicator">
          🍀 Chance Shiny: Tu es {Number(shinyRate) < 4096 ? 'chanceux' : 'dans la moyenne'} !
        </div>
      )}
    </div>
  );
};

export default StatsView;
