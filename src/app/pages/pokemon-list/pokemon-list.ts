import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PokemonService, PokemonListResponse } from '../../services/pokemon';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss'
})
export class PokemonList implements OnInit {
  pokemons: any[] = [];
  offset = 0;
  limit = 20;
  totalPokemons = 0;
  loading = false;
  error: string | null = null;

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    this.loading = true;
    this.error = null;

    this.pokemonService.getPokemons(this.offset, this.limit).subscribe({
      next: (response: PokemonListResponse) => {
        this.totalPokemons = response.count;
        
        const pokemonDetails = response.results.map(pokemon => {
          // Extract the ID from the URL
          const urlParts = pokemon.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 2], 10);
          
          return {
            id,
            name: pokemon.name,
            imageUrl: this.pokemonService.getImageUrl(id),
            isFavorite: this.favoritesService.isFavorite(id)
          };
        });
        
        this.pokemons = [...this.pokemons, ...pokemonDetails];
        this.loading = false;
        
        if (event) {
          event.target.complete();
        }
      },
      error: (err) => {
        this.error = 'Erro ao carregar Pokémons. Tente novamente.';
        this.loading = false;
        if (event) {
          event.target.complete();
        }
        console.error('Error loading pokemons:', err);
      }
    });
  }

  loadMore(event: any) {
    this.offset += this.limit;
    this.loadPokemons(event);
    
    // Disable infinite scroll if all pokemons are loaded
    if (this.offset + this.limit >= this.totalPokemons) {
      event.target.disabled = true;
    }
  }

  toggleFavorite(pokemon: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    
    this.favoritesService.toggleFavorite(pokemon.id);
    pokemon.isFavorite = this.favoritesService.isFavorite(pokemon.id);
  }

  doRefresh(event: any) {
    this.offset = 0;
    this.pokemons = [];
    this.loadPokemons();
    event.target.complete();
  }
}
