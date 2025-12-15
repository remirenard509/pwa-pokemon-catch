export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
  };
  captureRate: number;
}

export interface CapturedPokemon extends Pokemon {
  captureId: string;
  isShiny: boolean;
  capturedAt: number;
  ballUsed: 'poke' | 'great' | 'ultra';
}

export interface GameStats {
  totalEncounters: number;
  totalCaptures: number;
  totalEscapes: number;
  shinyEncounters: number;
  shinyCaptured: number;
  ballsUsed: {
    poke: number;
    great: number;
    ultra: number;
  };
}

export interface PokedexEntry {
  id: number;
  name: string;
  captureCount: number;
  shinyCount: number;
  firstCaptured: number;
  sprite: string;
  types: string[];
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  species: {
    url: string;
  };
}

export interface PokemonSpeciesResponse {
  capture_rate: number;
}
