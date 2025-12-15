import type { Pokemon, PokemonApiResponse, PokemonSpeciesResponse } from '../types';
import { POKEAPI_BASE_URL, MAX_POKEMON_ID, SHINY_CHANCE } from '../constants';

class PokemonService {
  private async fetchPokemonData(id: number): Promise<Pokemon> {
    try {
      const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);
      if (!response.ok) throw new Error('Pokémon not found');
      
      const data: PokemonApiResponse = await response.json();

      const speciesResponse = await fetch(data.species.url);
      if (!speciesResponse.ok) throw new Error('Species not found');
      
      const speciesData: PokemonSpeciesResponse = await speciesResponse.json();

      const types = data.types.map(t => t.type.name);

      const hpStat = data.stats.find(s => s.stat.name === 'hp');
      const attackStat = data.stats.find(s => s.stat.name === 'attack');
      const defenseStat = data.stats.find(s => s.stat.name === 'defense');

      return {
        id: data.id,
        name: this.capitalizeFirstLetter(data.name),
        sprite: data.sprites.front_default,
        sprites: {
          front_default: data.sprites.front_default,
          front_shiny: data.sprites.front_shiny
        },
        types,
        stats: {
          hp: hpStat?.base_stat || 0,
          attack: attackStat?.base_stat || 0,
          defense: defenseStat?.base_stat || 0
        },
        captureRate: speciesData.capture_rate
      };
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      throw error;
    }
  }

  async getRandomPokemon(): Promise<{ pokemon: Pokemon; isShiny: boolean }> {
    const randomId = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
    const pokemon = await this.fetchPokemonData(randomId);
    const isShiny = Math.random() < SHINY_CHANCE;
    
    return { pokemon, isShiny };
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    return this.fetchPokemonData(id);
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const pokemonService = new PokemonService();
