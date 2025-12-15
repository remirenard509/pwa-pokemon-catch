import type { CapturedPokemon, GameStats, PokedexEntry } from '../types';
import { STORAGE_KEYS } from '../constants';

const defaultStats: GameStats = {
  totalEncounters: 0,
  totalCaptures: 0,
  totalEscapes: 0,
  shinyEncounters: 0,
  shinyCaptured: 0,
  ballsUsed: {
    poke: 0,
    great: 0,
    ultra: 0
  }
};

export const getCapturedPokemon = (): CapturedPokemon[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CAPTURED);
  return data ? JSON.parse(data) : [];
};

export const addCapturedPokemon = (pokemon: CapturedPokemon): void => {
  const captured = getCapturedPokemon();
  captured.push(pokemon);
  localStorage.setItem(STORAGE_KEYS.CAPTURED, JSON.stringify(captured));
};

export const removeCapturedPokemon = (captureId: string): void => {
  const captured = getCapturedPokemon().filter(p => p.captureId !== captureId);
  localStorage.setItem(STORAGE_KEYS.CAPTURED, JSON.stringify(captured));
};

export const getStats = (): GameStats => {
  const data = localStorage.getItem(STORAGE_KEYS.STATS);
  return data ? JSON.parse(data) : defaultStats;
};

export const updateStats = (stats: GameStats): void => {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
};

export const incrementStat = (
  stat: keyof Omit<GameStats, 'ballsUsed'> | { ball: 'poke' | 'great' | 'ultra' }
): void => {
  const stats = getStats();
  
  if (typeof stat === 'string') {
    stats[stat]++;
  } else {
    stats.ballsUsed[stat.ball]++;
  }
  
  updateStats(stats);
};

export const getPokedex = (): PokedexEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.POKEDEX);
  return data ? JSON.parse(data) : [];
};

export const updatePokedex = (pokemon: CapturedPokemon): void => {
  const pokedex = getPokedex();
  const existingEntry = pokedex.find(entry => entry.id === pokemon.id);

  if (existingEntry) {
    existingEntry.captureCount++;
    if (pokemon.isShiny) {
      existingEntry.shinyCount++;
    }
  } else {
    pokedex.push({
      id: pokemon.id,
      name: pokemon.name,
      captureCount: 1,
      shinyCount: pokemon.isShiny ? 1 : 0,
      firstCaptured: pokemon.capturedAt,
      sprite: pokemon.sprite,
      types: pokemon.types
    });
  }

  localStorage.setItem(STORAGE_KEYS.POKEDEX, JSON.stringify(pokedex));
};

export const getTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
