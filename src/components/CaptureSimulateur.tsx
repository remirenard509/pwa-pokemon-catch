import React, { useState } from 'react';
import type { Pokemon, CapturedPokemon } from '../types';
import { pokemonService } from '../services/pokemonService';
import { audioService } from '../services/audioService';
import { 
  getCapturedPokemon, 
  addCapturedPokemon, 
  incrementStat,
  updatePokedex 
} from '../services/storageService';
import { MAX_CAPTURED, BALL_RATES } from '../constants';
import Modal from './Modal';

interface Props {
  onCapture: () => void;
}

const CaptureSimulator: React.FC<Props> = ({ onCapture }) => {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [isCurrentShiny, setIsCurrentShiny] = useState(false);
  const [selectedBall, setSelectedBall] = useState<'poke' | 'great' | 'ultra'>('poke');
  const [shakeCount, setShakeCount] = useState(0);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [captureAnimation, setCaptureAnimation] = useState(false);
  const [showTeamFullModal, setShowTeamFullModal] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3); // ✅ NOUVEAU : Compteur de tentatives

    const ballTypes = [
    { 
        type: 'poke' as const, 
        name: 'Poké Ball', 
        multiplier: 1, 
        image: '/pokeballs/poke-ball.png'
    },
    { 
        type: 'great' as const, 
        name: 'Super Ball', 
        multiplier: 1.5, 
        image: '/pokeballs/great-ball.png'
    },
    { 
        type: 'ultra' as const, 
        name: 'Hyper Ball', 
        multiplier: 2, 
        image: '/pokeballs/ultra-ball.png'
    }
    ];

  const generateRandomPokemon = async () => {
    setLoading(true);
    setMessage('');
    setShakeCount(0);
    setCaptureSuccess(false);
    setAttemptsLeft(3); // ✅ Réinitialiser les tentatives

    try {
      const { pokemon, isShiny } = await pokemonService.getRandomPokemon();
      setCurrentPokemon(pokemon);
      setIsCurrentShiny(isShiny);
      incrementStat('totalEncounters');

      if (isShiny) {
        incrementStat('shinyEncounters');
        setMessage('✨ Un Pokémon Shiny est apparu ! ✨');
        audioService.playShinySound();
      }
    } catch (error) {
      setMessage('❌ Erreur de chargement. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCaptureRate = (): number => {
    if (!currentPokemon) return 0;

    const { captureRate, stats } = currentPokemon;
    const maxHP = stats.hp;
    const currentHP = maxHP;
    const ballMultiplier = BALL_RATES[selectedBall];
    const statusMultiplier = 1;

    const a = ((3 * maxHP - 2 * currentHP) * captureRate * ballMultiplier * statusMultiplier) / (3 * maxHP);
    const captureChance = Math.min((a / 255) * 100, 100);

    return Math.round(captureChance);
  };

  

  const simulateCapture = async () => {
    if (!currentPokemon || captureSuccess || attemptsLeft === 0) return;

    const capturedCount = getCapturedPokemon().length;
    if (capturedCount >= MAX_CAPTURED) {
      setShowTeamFullModal(true);
      return;
    }

    // ✅ Décrémenter les tentatives
    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);

    audioService.playThrow();
    setCaptureAnimation(true);
    incrementStat({ ball: selectedBall });

    setTimeout(() => {
      setCaptureAnimation(false);
      performShakes(newAttemptsLeft);
    }, 800);
  };

  const performShakes = async (remainingAttempts: number) => {
    const captureChance = calculateCaptureRate();

    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setShakeCount(i);
      audioService.playShake();

      const shakeChance = Math.random() * 100;
      if (shakeChance > captureChance) {
        // ❌ ÉCHEC
        incrementStat('totalEscapes');
        setTimeout(() => {
          if (remainingAttempts === 0) {
            // ⚠️ Plus de tentatives - fuite définitive
            setMessage(
              isCurrentShiny 
                ? `💔 ${currentPokemon?.name} Shiny s'est enfui définitivement... 💔`
                : `😢 ${currentPokemon?.name} s'est enfui !`
            );
          } else {
            // ✅ Il reste des tentatives
            setMessage(
              isCurrentShiny
                ? `💨 ${currentPokemon?.name} Shiny s'est échappé ! ${remainingAttempts} tentative(s) restante(s) ✨`
                : `💨 ${currentPokemon?.name} s'est échappé ! ${remainingAttempts} tentative(s) restante(s)`
            );
          }
          audioService.playFail();
          setShakeCount(0);
        }, 400);
        return;
      }
    }

    // ✅ SUCCÈS
    setTimeout(() => {
      capturePokemon();
    }, 400);
  };

  const capturePokemon = () => {
    if (!currentPokemon) return;

    const captured: CapturedPokemon = {
      ...currentPokemon,
      captureId: `${Date.now()}-${Math.random()}`,
      isShiny: isCurrentShiny,
      capturedAt: Date.now(),
      ballUsed: selectedBall
    };

    addCapturedPokemon(captured);
    updatePokedex(captured);
    incrementStat('totalCaptures');

    if (isCurrentShiny) {
      incrementStat('shinyCaptured');
    }

    setCaptureSuccess(true);
    setMessage(`🎉 ${currentPokemon.name} ${isCurrentShiny ? '✨ Shiny' : ''} capturé !`);
    audioService.playSuccess();
    onCapture();
  };

  const getTypeEmoji = (type: string): string => {
    const typeEmojis: { [key: string]: string } = {
      normal: '⚪', fire: '🔥', water: '💧', electric: '⚡',
      grass: '🌿', ice: '❄️', fighting: '👊', poison: '☠️',
      ground: '⛰️', flying: '🦅', psychic: '🔮', bug: '🐛',
      rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌙',
      steel: '⚙️', fairy: '🧚'
    };
    return typeEmojis[type] || '❓';
  };

  return (
    <div className="capture-simulator">
      <button
        className="generate-button"
        onClick={generateRandomPokemon}
        disabled={loading || (!!currentPokemon && !captureSuccess && attemptsLeft > 0)}
      >
        {loading ? '🔄 Chargement...' : currentPokemon && !captureSuccess && attemptsLeft > 0 ? '⏳ En cours...' : '🔍 Chercher un Pokémon'}
      </button>

      {currentPokemon && (
        <>
          <div className={`pokemon-display ${isCurrentShiny ? 'shiny' : ''}`}>
            {isCurrentShiny && <div className="shiny-badge">✨ SHINY ✨</div>}

            <img
              src={isCurrentShiny ? currentPokemon.sprites.front_shiny : currentPokemon.sprites.front_default}
              alt={currentPokemon.name}
              className={`pokemon-sprite ${isCurrentShiny ? 'shiny' : ''} ${captureAnimation ? 'capturing' : ''}`}
            />

            <h2 className="pokemon-name">
              {currentPokemon.name} <span className="pokemon-id">#{currentPokemon.id}</span>
            </h2>

            <div className="pokemon-types">
              {currentPokemon.types.map(type => (
                <span key={type} className={`type-badge type-${type}`}>
                  {getTypeEmoji(type)} {type}
                </span>
              ))}
            </div>

            <div className="pokemon-stats">
              <div className="stat">
                <span className="stat-label">HP:</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill hp" 
                    style={{ width: `${(currentPokemon.stats.hp / 255) * 100}%` }}
                  />
                </div>
                <span className="stat-value">{currentPokemon.stats.hp}</span>
              </div>
              <div className="stat">
                <span className="stat-label">ATK:</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill attack" 
                    style={{ width: `${(currentPokemon.stats.attack / 255) * 100}%` }}
                  />
                </div>
                <span className="stat-value">{currentPokemon.stats.attack}</span>
              </div>
              <div className="stat">
                <span className="stat-label">DEF:</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill defense" 
                    style={{ width: `${(currentPokemon.stats.defense / 255) * 100}%` }}
                  />
                </div>
                <span className="stat-value">{currentPokemon.stats.defense}</span>
              </div>
            </div>
          </div>

          {!captureSuccess && attemptsLeft > 0 && (
            <>
                <div className="ball-selector">
                    <h3>Choisir une Poké Ball</h3>
                    <div className="ball-options">
                        {ballTypes.map(ball => {
                        // Calcul du taux pour chaque ball
                        const tempRate = currentPokemon ? 
                            Math.round(Math.min(
                            ((3 * currentPokemon.stats.hp - 2 * currentPokemon.stats.hp) * 
                            currentPokemon.captureRate * 
                            ball.multiplier) / 
                            (3 * currentPokemon.stats.hp) / 255 * 100, 
                            100
                            )) : 0;

                        return (
                            <button
                            key={ball.type}
                            className={`ball-option ${selectedBall === ball.type ? 'selected' : ''}`}
                            onClick={() => setSelectedBall(ball.type)}
                            disabled={captureAnimation || shakeCount > 0}
                            >
                            <img 
                                src={ball.image} 
                                alt={ball.name}
                                className="ball-image"
                            />
                            <span className="ball-name">{ball.name}</span>
                            <span className="ball-multiplier">x{ball.multiplier}</span>
                            <span className="ball-rate">{tempRate}%</span>
                            </button>
                        );
                        })}
                    </div>
             </div>


              <div className="capture-info">
              
                {/* ✅ AFFICHER LES TENTATIVES RESTANTES */}
                <div className="attempts-left">
                  Tentatives restantes: <strong>{attemptsLeft}</strong> {'⚾'.repeat(attemptsLeft)}
                </div>
                {shakeCount > 0 && (
                  <div className="shake-indicator">
                    {'🔴'.repeat(shakeCount)}{'⚪'.repeat(3 - shakeCount)}
                  </div>
                )}
              </div>

              <button
                className="capture-button"
                onClick={simulateCapture}
                disabled={captureAnimation || shakeCount > 0 || attemptsLeft === 0}
              >
                {captureAnimation ? '🎯 Lancer...' : shakeCount > 0 ? '⏳ Capture en cours...' : `🎯 Lancer la Ball ! (${attemptsLeft})`}
              </button>
            </>
          )}

          {/* ✅ BOUTON "POKÉMON SUIVANT" si plus de tentatives ou capture réussie */}
          {(captureSuccess || attemptsLeft === 0) && (
            <button 
              className="new-pokemon-button"
              onClick={generateRandomPokemon}
              disabled={loading}
            >
              {captureSuccess ? '🔍 Chercher un autre Pokémon' : '➡️ Pokémon suivant'}
            </button>
          )}

          {message && (
            <div className={`capture-message ${message.includes('✨') ? 'shiny-message' : ''} ${captureSuccess ? 'success' : message.includes('❌') || message.includes('💔') ? 'failure' : ''}`}>
              {message}
            </div>
          )}
        </>
      )}

      {captureAnimation && <div className="capture-animation"></div>}

      <Modal
        isOpen={showTeamFullModal}
        onClose={() => setShowTeamFullModal(false)}
        title="⚠️ Équipe Complète"
      >
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Tu as déjà {MAX_CAPTURED} Pokémon dans ton équipe !
          <br />
          Libère un Pokémon pour en capturer un nouveau.
        </p>
      </Modal>
    </div>
  );
};

export default CaptureSimulator;
