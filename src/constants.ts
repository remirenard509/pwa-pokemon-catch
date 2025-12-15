export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
export const MAX_POKEMON_ID = 898;
export const SHINY_CHANCE = 1 / 4096;
export const MAX_CAPTURED = 6;

export const BALL_RATES = {
  poke: 1,
  great: 1.5,
  ultra: 2
} as const;

export const STORAGE_KEYS = {
  CAPTURED: 'captured_pokemon',
  STATS: 'game_stats',
  POKEDEX: 'pokedex',
  THEME: 'theme'
} as const;
