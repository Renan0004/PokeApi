import { Routes } from '@angular/router';
import { PokemonList } from './pages/pokemon-list/pokemon-list';
import { PokemonDetails } from './pages/pokemon-details/pokemon-details';
import { Favorites } from './pages/favorites/favorites';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
  { path: 'pokemons', component: PokemonList },
  { path: 'pokemons/:id', component: PokemonDetails },
  { path: 'favorites', component: Favorites },
  { path: '**', redirectTo: 'pokemons' }
];
