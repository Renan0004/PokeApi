import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  protected title = 'Pokedex';

  constructor(public router: Router) {}

  ngOnInit() {
    console.log('Componente App inicializado');
  }

  navigateToPokemons() {
    this.router.navigate(['/pokemons']);
  }

  navigateToFavorites() {
    this.router.navigate(['/favorites']);
  }

  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }
}
