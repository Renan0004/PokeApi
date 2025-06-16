import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PokemonDetail } from './pokemon';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey = 'favorite_pokemons';
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFavorites();
  }

  private loadFavorites(): void {
    if (!this.isBrowser) {
      // Se não estamos no navegador, inicialize com array vazio
      this.favoritesSubject.next([]);
      return;
    }

    const storedFavorites = localStorage.getItem(this.storageKey);
    if (storedFavorites) {
      try {
        const favorites = JSON.parse(storedFavorites);
        this.favoritesSubject.next(favorites);
      } catch (error) {
        console.error('Erro ao analisar favoritos do localStorage:', error);
        this.favoritesSubject.next([]);
      }
    } else {
      this.favoritesSubject.next([]);
    }
  }

  private saveFavorites(favorites: number[]): void {
    if (!this.isBrowser) return;
    
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  addToFavorites(pokemon: PokemonDetail | number): void {
    const pokemonId = typeof pokemon === 'number' ? pokemon : pokemon.id;
    const currentFavorites = this.favoritesSubject.value;
    
    if (!currentFavorites.includes(pokemonId)) {
      const updatedFavorites = [...currentFavorites, pokemonId];
      this.saveFavorites(updatedFavorites);
    }
  }

  removeFromFavorites(pokemon: PokemonDetail | number): void {
    const pokemonId = typeof pokemon === 'number' ? pokemon : pokemon.id;
    const currentFavorites = this.favoritesSubject.value;
    
    if (currentFavorites.includes(pokemonId)) {
      const updatedFavorites = currentFavorites.filter(id => id !== pokemonId);
      this.saveFavorites(updatedFavorites);
    }
  }

  isFavorite(pokemonId: number): boolean {
    return this.favoritesSubject.value.includes(pokemonId);
  }

  toggleFavorite(pokemon: PokemonDetail | number): void {
    const pokemonId = typeof pokemon === 'number' ? pokemon : pokemon.id;
    
    if (this.isFavorite(pokemonId)) {
      this.removeFromFavorites(pokemonId);
    } else {
      this.addToFavorites(pokemonId);
    }
  }

  getFavorites(): number[] {
    return [...this.favoritesSubject.value];
  }
}
