import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { IonicModule, IonContent } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PokemonService, PokemonListResponse } from '../../services/pokemon';
import { FavoritesService } from '../../services/favorites';

interface PokemonItem {
  id: number;
  name: string;
  imageUrl: string;
  isFavorite: boolean;
  image?: string; // Adicionando propriedade image como alternativa para imageUrl
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
  @ViewChild(IonContent) content?: IonContent;
  
  pokemons: PokemonItem[] = [];
  filteredPokemons: PokemonItem[] = [];
  offset = 0;
  limit = 20;
  totalPokemons = 0;
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  allPokemonsLoaded = false;

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Componente PokemonList inicializado');
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    this.loading = true;
    this.error = null;
    console.log(`Carregando pokémons com offset ${this.offset} e limit ${this.limit}`);

    this.pokemonService.getPokemons(this.offset, this.limit).subscribe({
      next: (response: PokemonListResponse) => {
        console.log('Resposta da API recebida:', response);
        this.totalPokemons = response.count;
        
        const pokemonDetails = response.results.map(pokemon => {
          // Extrair o ID da URL
          const urlParts = pokemon.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 2], 10);
          
          return {
            id,
            name: pokemon.name,
            imageUrl: this.pokemonService.getImageUrl(id),
            image: this.pokemonService.getImageUrl(id), // Adicionando image como cópia de imageUrl
            isFavorite: this.favoritesService.isFavorite(id)
          };
        });
        
        console.log('Detalhes de pokémon processados:', pokemonDetails);
        this.updatePokemonList(pokemonDetails, event);
        
        // Verificar se todos os pokémons foram carregados
        this.allPokemonsLoaded = this.pokemons.length >= this.totalPokemons;
      },
      error: (err) => {
        console.error('Erro ao carregar pokémons:', err);
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
    
    // Desativar o scroll infinito se todos os pokémons estiverem carregados
    if (this.offset + this.limit >= this.totalPokemons) {
      event.target.disabled = true;
    }
  }

  // Método para carregar mais pokémons (usado no botão)
  loadMorePokemons() {
    this.offset += this.limit;
    this.loadPokemons();
  }

  // Método para visualizar detalhes do pokémon
  viewPokemonDetails(id: number) {
    this.router.navigate(['/pokemons', id]);
  }

  // Método para filtrar pokémons (usado no ionInput)
  filterPokemons() {
    this.applyFilter();
  }

  // Método para verificar se um pokémon é favorito
  isFavorite(id: number): boolean {
    return this.favoritesService.isFavorite(id);
  }

  // Método corrigido para alternar favorito
  toggleFavorite(event: Event, id: number) {
    event.stopPropagation();
    
    this.favoritesService.toggleFavorite(id);
    // Atualiza o status de favorito na lista
    const pokemon = this.pokemons.find(p => p.id === id);
    if (pokemon) {
      pokemon.isFavorite = this.favoritesService.isFavorite(id);
    }
  }

  // Método para rolar para o topo
  scrollToTop() {
    this.content?.scrollToTop(500);
  }

  doRefresh(event: any) {
    console.log('Atualizando lista de Pokémon');
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
