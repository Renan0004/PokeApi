import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PokemonDetail } from './pokemon';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey = 'favorite_pokemons';
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const storedFavorites = localStorage.getItem(this.storageKey);
    if (storedFavorites) {
      try {
        const favorites = JSON.parse(storedFavorites);
        this.favoritesSubject.next(favorites);
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        this.favoritesSubject.next([]);
      }
    } else {
      this.favoritesSubject.next([]);
    }
  }

  private saveFavorites(favorites: number[]): void {
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
