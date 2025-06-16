import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PokemonService, PokemonDetail } from '../../services/pokemon';
import { FavoritesService } from '../../services/favorites';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class Favorites implements OnInit {
  favoritePokemons: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadFavorites();
    
    // Subscribe to changes in favorites
    this.favoritesService.favorites$.subscribe(() => {
      this.loadFavorites();
    });
  }

  loadFavorites() {
    const favoriteIds = this.favoritesService.getFavorites();
    
    if (favoriteIds.length === 0) {
      this.favoritePokemons = [];
      return;
    }
    
    this.loading = true;
    
    // Create an array of observables for each pokemon detail request
    const requests = favoriteIds.map(id => 
      this.pokemonService.getPokemonDetail(id).pipe(
        catchError(error => {
          console.error(`Error fetching pokemon ${id}:`, error);
          return of(null);
        })
      )
    );
    
    // Execute all requests in parallel
    forkJoin(requests).subscribe({
      next: (results) => {
        // Filter out any null results from failed requests
        this.favoritePokemons = results
          .filter(pokemon => pokemon !== null)
          .map((pokemon: PokemonDetail) => ({
            id: pokemon.id,
            name: pokemon.name,
            imageUrl: this.pokemonService.getImageUrl(pokemon.id),
            types: pokemon.types.map(t => t.type.name)
          }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar Pokémons favoritos';
        this.loading = false;
        console.error('Error loading favorite pokemons:', err);
      }
    });
  }

  removeFromFavorites(pokemon: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    
    this.favoritesService.removeFromFavorites(pokemon.id);
  }

  doRefresh(event: any) {
    this.loadFavorites();
    event.target.complete();
  }
}
