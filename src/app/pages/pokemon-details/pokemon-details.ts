import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PokemonService, PokemonDetail, PokemonSpecies } from '../../services/pokemon';
import { FavoritesService } from '../../services/favorites';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pokemon-details.html',
  styleUrl: './pokemon-details.scss'
})
export class PokemonDetails implements OnInit {
  pokemon: PokemonDetail | null = null;
  species: PokemonSpecies | null = null;
  loading = false;
  error: string | null = null;
  isFavorite = false;
  
  // Computed properties for display
  pokemonDetails: { label: string; value: string | number }[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) {}
  
  ngOnInit() {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.error = 'Pokémon não encontrado';
      this.loading = false;
      return;
    }
    
    // Check if this pokemon is a favorite
    this.isFavorite = this.favoritesService.isFavorite(parseInt(id, 10));
    
    // Load both pokemon details and species info in parallel
    forkJoin({
      pokemon: this.pokemonService.getPokemonDetail(id),
      species: this.pokemonService.getPokemonSpecies(parseInt(id, 10))
    }).subscribe({
      next: (response) => {
        this.pokemon = response.pokemon;
        this.species = response.species;
        this.prepareDetails();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar detalhes do Pokémon';
        this.loading = false;
        console.error('Error loading pokemon details:', err);
      }
    });
  }
  
  prepareDetails() {
    if (!this.pokemon || !this.species) return;
    
    // Prepare the details to display
    this.pokemonDetails = [
      {
        label: 'Altura',
        value: `${(this.pokemon.height / 10).toFixed(1)} m`
      },
      {
        label: 'Peso',
        value: `${(this.pokemon.weight / 10).toFixed(1)} kg`
      },
      {
        label: 'Tipos',
        value: this.pokemon.types.map(t => t.type.name).join(', ')
      },
      {
        label: 'Habilidades',
        value: this.pokemon.abilities.map(a => a.ability.name).join(', ')
      },
      {
        label: 'Descrição',
        value: this.pokemonService.getEnglishFlavorText(this.species)
      },
      {
        label: 'Categoria',
        value: this.species.genera.find(g => g.language.name === 'en')?.genus || 'Unknown'
      }
    ];
    
    // Add stats
    this.pokemon.stats.forEach(stat => {
      this.pokemonDetails.push({
        label: this.formatStatName(stat.stat.name),
        value: stat.base_stat
      });
    });
  }
  
  formatStatName(name: string): string {
    const statNames: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defesa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defesa Especial',
      'speed': 'Velocidade'
    };
    
    return statNames[name] || name;
  }
  
  toggleFavorite() {
    if (!this.pokemon) return;
    
    this.favoritesService.toggleFavorite(this.pokemon.id);
    this.isFavorite = this.favoritesService.isFavorite(this.pokemon.id);
  }
  
  goBack() {
    this.router.navigate(['/pokemons']);
  }
}
