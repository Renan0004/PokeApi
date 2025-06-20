import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, catchError as rxjsCatchError } from 'rxjs';
import { map, tap, catchError, timeout, shareReplay, retry } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  height: number;
  weight: number;
  types: {
    type: {
      name: string;
    }
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    }
  }[];
  species: {
    url: string;
  };
  moves: {
    move: {
      name: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
      };
    }[];
  }[];
}

export interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';
  private timeoutDuration = 30000; // 30 segundos para timeout
  private cacheTime = 60 * 60 * 1000; // 1 hora em milissegundos
  private cachedResponses: { [key: string]: any } = {};
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    console.log('Serviço PokemonService inicializado');
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCacheFromStorage();
  }

  // Carregar cache do localStorage ao iniciar o serviço
  private loadCacheFromStorage(): void {
    if (!this.isBrowser) {
      console.log('Não estamos no navegador, pulando carregamento do localStorage');
      return;
    }
    
    try {
      const cachedData = localStorage.getItem('pokemon_cache');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // Verificar se o cache não está expirado
        if (parsedData.timestamp && (Date.now() - parsedData.timestamp) < this.cacheTime) {
          this.cachedResponses = parsedData.data || {};
          console.log('Cache carregado do localStorage:', Object.keys(this.cachedResponses).length, 'itens');
        } else {
          // Cache expirado, limpar
          localStorage.removeItem('pokemon_cache');
          console.log('Cache expirado, removido do localStorage');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
      if (this.isBrowser) {
        localStorage.removeItem('pokemon_cache');
      }
    }
  }

  // Salvar cache no localStorage
  private saveCache(): void {
    if (!this.isBrowser) {
      return; // Não salvar cache se não estiver no navegador
    }
    
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: this.cachedResponses
      };
      localStorage.setItem('pokemon_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  getPokemons(offset: number = 0, limit: number = 20): Observable<PokemonListResponse> {
    const cacheKey = `pokemon_list_${offset}_${limit}`;
    
    // Verificar se temos dados em cache
    if (this.cachedResponses[cacheKey]) {
      console.log(`Usando cache para ${cacheKey}`);
      return of(this.cachedResponses[cacheKey]);
    }

    console.log(`Chamando API: ${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`);
    
    return this.http.get<PokemonListResponse>(`${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`)
      .pipe(
        retry(2), // Tentar novamente até 2 vezes em caso de falha
        timeout(this.timeoutDuration),
        tap(response => {
          console.log('Resposta da API:', response);
          // Salvar no cache
          this.cachedResponses[cacheKey] = response;
          this.saveCache();
        }),
        catchError(error => {
          console.error('Erro ao buscar pokémons:', error);
          return throwError(() => new Error('Falha ao carregar a lista de Pokémon. Por favor, tente novamente mais tarde.'));
        }),
        // Compartilhar a mesma resposta para múltiplas inscrições
        shareReplay(1)
      );
  }

  getPokemonDetail(id: string | number): Observable<PokemonDetail> {
    const cacheKey = `pokemon_detail_${id}`;
    
    // Verificar se temos dados em cache
    if (this.cachedResponses[cacheKey]) {
      console.log(`Usando cache para ${cacheKey}`);
      return of(this.cachedResponses[cacheKey]);
    }
    
    console.log(`Buscando detalhes do pokémon: ${id}`);
    
    return this.http.get<PokemonDetail>(`${this.apiUrl}/pokemon/${id}`)
      .pipe(
        retry(2), // Tentar novamente até 2 vezes em caso de falha
        timeout(this.timeoutDuration),
        tap(response => {
          console.log('Resposta de detalhes do Pokémon:', response);
          // Salvar no cache
          this.cachedResponses[cacheKey] = response;
          this.saveCache();
        }),
        catchError(error => {
          console.error(`Erro ao buscar pokémon ${id}:`, error);
          return throwError(() => new Error(`Falha ao carregar os detalhes do Pokémon ${id}. Por favor, tente novamente mais tarde.`));
        }),
        shareReplay(1)
      );
  }

  getPokemonSpecies(id: number): Observable<PokemonSpecies> {
    const cacheKey = `pokemon_species_${id}`;
    
    // Verificar se temos dados em cache
    if (this.cachedResponses[cacheKey]) {
      console.log(`Usando cache para ${cacheKey}`);
      return of(this.cachedResponses[cacheKey]);
    }
    
    return this.http.get<PokemonSpecies>(`${this.apiUrl}/pokemon-species/${id}`)
      .pipe(
        retry(2), // Tentar novamente até 2 vezes em caso de falha
        timeout(this.timeoutDuration),
        tap(response => {
          console.log('Resposta de espécies do Pokémon:', response);
          // Salvar no cache
          this.cachedResponses[cacheKey] = response;
          this.saveCache();
        }),
        catchError(error => {
          console.error(`Erro ao buscar espécies do pokémon ${id}:`, error);
          return throwError(() => new Error(`Falha ao carregar as informações da espécie do Pokémon ${id}. Por favor, tente novamente mais tarde.`));
        }),
        shareReplay(1)
      );
  }

  getEnglishFlavorText(species: PokemonSpecies): string {
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en' || entry.language.name === 'pt-br'
    );
    return englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ') : 'Sem descrição disponível.';
  }

  getImageUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  clearCache(): void {
    this.cachedResponses = {};
    if (this.isBrowser) {
      localStorage.removeItem('pokemon_cache');
    }
    console.log('Cache limpo');
  }
}
