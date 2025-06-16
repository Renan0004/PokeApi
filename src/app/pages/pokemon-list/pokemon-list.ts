import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PokemonService, PokemonListResponse } from '../../services/pokemon';
import { FavoritesService } from '../../services/favorites';

interface PokemonItem {
  id: number;
  name: string;
  imageUrl: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pokemon-list.html',
  styleUrls: ['./pokemon-list.scss']
})
export class PokemonList implements OnInit {
  pokemons: PokemonItem[] = [];
  filteredPokemons: PokemonItem[] = [];
  offset = 0;
  limit = 20;
  totalPokemons = 0;
  loading = false;
  error: string | null = null;
  searchTerm: string = '';

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('PokemonList component initialized');
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    this.loading = true;
    this.error = null;
    console.log(`Loading pokemons with offset ${this.offset} and limit ${this.limit}`);

    this.pokemonService.getPokemons(this.offset, this.limit).subscribe({
      next: (response: PokemonListResponse) => {
        console.log('API response received:', response);
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
        
        console.log('Processed pokemon details:', pokemonDetails);
        this.updatePokemonList(pokemonDetails, event);
      },
      error: (err) => {
        console.error('Error loading pokemons:', err);
        this.error = 'Erro ao carregar Pokémons. Tente novamente.';
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  // Atualizar a lista de pokémons com os dados reais da API
  private updatePokemonList(pokemonDetails: PokemonItem[], event?: any) {
    if (this.offset === 0) {
      this.pokemons = pokemonDetails;
    } else {
      this.pokemons = [...this.pokemons, ...pokemonDetails];
    }
    
    this.applyFilter();
    this.loading = false;
    
    if (event) {
      event.target.complete();
    }
  }

  loadMore(event: any) {
    this.offset += this.limit;
    this.loadPokemons(event);
    
    // Disable infinite scroll if all pokemons are loaded
    if (this.offset + this.limit >= this.totalPokemons) {
      event.target.disabled = true;
    }
  }

  toggleFavorite(pokemon: PokemonItem, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    
    this.favoritesService.toggleFavorite(pokemon.id);
    pokemon.isFavorite = this.favoritesService.isFavorite(pokemon.id);
  }

  doRefresh(event: any) {
    console.log('Refreshing Pokemon list');
    this.offset = 0;
    this.pokemons = [];
    this.filteredPokemons = [];
    this.searchTerm = '';
    this.loadPokemons(event);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  retryLoading() {
    this.doRefresh(null);
  }

  // Limpar cache e recarregar
  clearCacheAndReload() {
    this.pokemonService.clearCache();
    this.doRefresh(null);
  }

  // Método para filtrar Pokémon por nome
  onSearchChange(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.applyFilter();
  }

  applyFilter() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredPokemons = [...this.pokemons];
    } else {
      this.filteredPokemons = this.pokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  // Método para limpar a pesquisa
  clearSearch() {
    this.searchTerm = '';
    this.applyFilter();
  }
}
