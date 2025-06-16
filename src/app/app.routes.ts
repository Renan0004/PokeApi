import { Routes } from '@angular/router';
import { PokemonList } from './pages/pokemon-list/pokemon-list';
import { PokemonDetails } from './pages/pokemon-details/pokemon-details';
import { Favorites } from './pages/favorites/favorites';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'pokemons', component: PokemonList },
  { path: 'pokemons/:id', component: PokemonDetails },
  { path: 'favorites', component: Favorites },
  { path: '**', redirectTo: 'home' }
];
