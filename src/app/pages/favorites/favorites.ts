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
    
    // Inscrever para mudanças nos favoritos
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
    
    // Criar um array de observables para cada requisição de detalhes de pokémon
    const requests = favoriteIds.map(id => 
      this.pokemonService.getPokemonDetail(id).pipe(
        catchError(error => {
          console.error(`Erro ao buscar pokémon ${id}:`, error);
          return of(null);
        })
      )
    );
    
    // Executar todas as requisições em paralelo
    forkJoin(requests).subscribe({
      next: (results) => {
        // Filtrar resultados nulos de requisições que falharam
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
        console.error('Erro ao carregar pokémons favoritos:', err);
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
