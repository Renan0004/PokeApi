import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { PokemonService } from '../../services/pokemon';
import { FavoritesService } from '../../services/favorites';
import { PokemonDetail, PokemonSpecies } from '../../services/pokemon';

interface PokemonDetailItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.html',
  styleUrls: ['./pokemon-details.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class PokemonDetails implements OnInit {
  pokemon: PokemonDetail | null = null;
  species: PokemonSpecies | null = null;
  loading = true;
  error: string | null = null;
  isFavorite = false;
  selectedSegment = 'details';
  pokemonDetails: PokemonDetailItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadPokemon();
  }

  loadPokemon() {
    this.loading = true;
    this.error = null;
    
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID do Pokémon não encontrado';
      this.loading = false;
      return;
    }

    this.pokemonService.getPokemonDetail(id).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.checkIfFavorite();
        this.loadSpecies(pokemon.id);
        this.generatePokemonDetails();
        console.log('Detalhes do Pokémon carregados:', pokemon);
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do Pokémon:', err);
        this.error = 'Não foi possível carregar os detalhes do Pokémon. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  loadSpecies(id: number) {
    this.pokemonService.getPokemonSpecies(id).subscribe({
      next: (species) => {
        this.species = species;
        console.log('Espécie do Pokémon carregada:', species);
        this.generatePokemonDetails();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar espécie do Pokémon:', err);
        // Não definimos erro aqui para não sobrescrever o detalhe do Pokémon que já foi carregado
        this.loading = false;
      }
    });
  }

  generatePokemonDetails() {
    if (!this.pokemon) return;
    
    this.pokemonDetails = [
      { label: 'Altura', value: `${this.pokemon.height / 10} m` },
      { label: 'Peso', value: `${this.pokemon.weight / 10} kg` },
      { label: 'Tipos', value: this.pokemon.types.map(t => t.type.name).join(', ') },
      { label: 'Habilidades', value: this.getAbilities() },
      { label: 'Descrição', value: this.getDescription() },
      { label: 'Categoria', value: this.getCategory() }
    ];
  }

  getDescription(): string {
    if (!this.species) return 'Carregando...';
    
    const flavorText = this.species.flavor_text_entries.find(entry => 
      entry.language.name === 'pt-br' || entry.language.name === 'en'
    );
    
    return flavorText ? flavorText.flavor_text.replace(/\n/g, ' ') : 'Sem descrição disponível';
  }

  getCategory(): string {
    if (!this.species) return 'Desconhecido';
    
    const genus = this.species.genera.find(g => 
      g.language.name === 'pt-br' || g.language.name === 'en'
    );
    
    return genus ? genus.genus : 'Pokémon';
  }

  getIconColor(label: string): string {
    const colors: {[key: string]: string} = {
      'Altura': 'primary',
      'Peso': 'secondary',
      'Tipos': 'danger',
      'Habilidades': 'success',
      'Descrição': 'warning',
      'Categoria': 'tertiary'
    };
    
    return colors[label] || 'medium';
  }

  checkIfFavorite() {
    if (this.pokemon) {
      this.isFavorite = this.favoritesService.isFavorite(this.pokemon.id);
    }
  }

  toggleFavorite() {
    if (!this.pokemon) return;
    
    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(this.pokemon.id);
      this.presentToast('Pokémon removido dos favoritos');
    } else {
      this.favoritesService.addToFavorites(this.pokemon);
      this.presentToast('Pokémon adicionado aos favoritos');
    }
    
    this.isFavorite = !this.isFavorite;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  getAbilities(): string {
    if (!this.pokemon) return '';
    
    return this.pokemon.abilities
      .map(ability => {
        const name = this.formatMoveName(ability.ability.name);
        return ability.is_hidden ? `${name} (Oculta)` : name;
      })
      .join(', ');
  }

  getMoves(): PokemonDetail['moves'] {
    if (!this.pokemon || !this.pokemon.moves) return [];
    
    // Filtrar apenas os movimentos aprendidos por level up e ordenar por nível
    return this.pokemon.moves
      .filter(move => 
        move.version_group_details.some(detail => 
          detail.move_learn_method.name === 'level-up'
        )
      )
      .sort((a, b) => {
        const levelA = a.version_group_details[0]?.level_learned_at || 0;
        const levelB = b.version_group_details[0]?.level_learned_at || 0;
        return levelA - levelB;
      })
      .slice(0, 20); // Limitar a 20 movimentos para não sobrecarregar a UI
  }

  formatMoveName(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getStatName(statName: string): string {
    const statNames: {[key: string]: string} = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defesa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defesa Especial',
      'speed': 'Velocidade'
    };
    
    return statNames[statName] || statName;
  }

  getStatColor(value: number): string {
    if (value < 50) return 'danger';
    if (value < 90) return 'warning';
    if (value < 120) return 'success';
    return 'primary';
  }

  goToPreviousPokemon() {
    if (this.pokemon && this.pokemon.id > 1) {
      this.router.navigate(['/pokemons', this.pokemon.id - 1]);
    }
  }

  goToNextPokemon() {
    if (this.pokemon) {
      this.router.navigate(['/pokemons', this.pokemon.id + 1]);
    }
  }

  goToPokemons() {
    this.router.navigate(['/pokemons']);
  }

  goBack() {
    this.router.navigate(['/pokemons']);
  }

  share() {
    if (!this.pokemon) return;
    
    // Implementação simplificada sem o Capacitor Share
    if (navigator.share) {
      navigator.share({
        title: `Pokémon: ${this.pokemon.name}`,
        text: `Confira este Pokémon: ${this.pokemon.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Compartilhado com sucesso'))
      .catch((error) => console.log('Erro ao compartilhar', error));
    } else {
      this.presentToast('Compartilhamento não suportado neste navegador');
    }
  }
}
