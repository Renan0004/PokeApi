import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule],
  template: `
    <div class="home-container">
      <div class="logo-container">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" class="pokemon-mascot">
        <img src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="Pokémon Logo" class="pokemon-logo">
      </div>
      
      <div class="welcome-card">
        <h1 class="welcome-title">Bem-vindo ao Pokédex!</h1>
        <p class="welcome-text">Explore informações detalhadas sobre todos os Pokémons, marque seus favoritos e descubra suas habilidades.</p>
        
        <div class="features-list">
          <div class="feature-item">
            <ion-icon name="list" class="feature-icon"></ion-icon>
            <span>Catálogo completo</span>
          </div>
          <div class="feature-item">
            <ion-icon name="heart" class="feature-icon"></ion-icon>
            <span>Salve favoritos</span>
          </div>
          <div class="feature-item">
            <ion-icon name="search" class="feature-icon"></ion-icon>
            <span>Detalhes completos</span>
          </div>
        </div>
        
        <div class="action-buttons">
          <div class="button-container">
            <ion-button routerLink="/pokemons" expand="block" shape="round" size="large" color="danger" class="main-button animate-pulse">
              <ion-icon name="list-outline" slot="start" size="large"></ion-icon>
              <span class="button-text">Ver lista de Pokémons</span>
            </ion-button>
          </div>
          
          <div class="button-container">
            <ion-button routerLink="/favorites" expand="block" shape="round" size="large" color="warning" class="secondary-button">
              <ion-icon name="star-outline" slot="start" size="large"></ion-icon>
              <span class="button-text">Ver Favoritos</span>
            </ion-button>
          </div>
        </div>
      </div>
      
      <div class="footer-info">
        <p>Desenvolvido com <ion-icon name="heart"></ion-icon> usando Angular & Ionic</p>
        <p>Dados fornecidos pela <a href="https://pokeapi.co/" target="_blank">PokéAPI</a></p>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      min-height: 90vh;
      padding: 20px;
      background-color: #f8f9fa;
    }
    
    .logo-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .pokemon-mascot {
      width: 120px;
      height: auto;
      margin-bottom: 10px;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    .pokemon-logo {
      max-width: 220px;
      height: auto;
      margin-bottom: 10px;
    }
    
    .welcome-card {
      background-color: white;
      border-radius: 20px;
      padding: 30px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 10px 20px rgba(0,0,0,0.12);
      margin-bottom: 40px;
    }
    
    .welcome-title {
      color: #e3350d;
      font-size: 2.2rem;
      margin-bottom: 16px;
      text-align: center;
      font-weight: 700;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    
    .welcome-text {
      text-align: center;
      margin-bottom: 30px;
      color: #444;
      font-size: 1.1rem;
      line-height: 1.6;
    }
    
    .features-list {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin-bottom: 30px;
      background-color: #f9f9f9;
      border-radius: 12px;
      padding: 15px 10px;
    }
    
    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      flex: 1;
      min-width: 100px;
    }
    
    .feature-icon {
      font-size: 28px;
      margin-bottom: 8px;
      color: #e3350d;
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 40px;
    }
    
    .button-container {
      position: relative;
      width: 100%;
      cursor: pointer;
      
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50px;
        padding: 3px;
        background: linear-gradient(135deg, #f5f5f5, #e3350d);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0.7;
      }
      
      &:hover {
        transform: translateY(-2px);
        transition: transform 0.3s ease;
      }
      
      &:active {
        transform: translateY(1px);
      }
    }
    
    .main-button {
      --border-radius: 50px;
      font-weight: 700;
      font-size: 1.1rem;
      height: 64px;
      --box-shadow: 0 8px 15px rgba(227, 53, 13, 0.4);
      letter-spacing: 0.5px;
      margin: 0;
      --background: linear-gradient(135deg, #ff7b00, #e3350d);
      --background-activated: linear-gradient(135deg, #e36d00, #c52d0c);
      --background-hover: linear-gradient(135deg, #ff7b00, #e3350d);
      cursor: pointer;
    }
    
    .secondary-button {
      --border-radius: 50px;
      font-weight: 700;
      font-size: 1.1rem;
      height: 64px;
      --box-shadow: 0 8px 15px rgba(255, 206, 0, 0.3);
      margin: 0;
      --background: linear-gradient(135deg, #ffce00, #ffa500);
      --background-activated: linear-gradient(135deg, #e6b800, #e69500);
      --background-hover: linear-gradient(135deg, #ffce00, #ffa500);
      cursor: pointer;
    }
    
    .button-text {
      font-size: 1.2rem;
      margin-left: 8px;
    }
    
    .animate-pulse {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
    
    .footer-info {
      text-align: center;
      color: #777;
      font-size: 0.9rem;
      margin-top: auto;
      padding-top: 20px;
    }
    
    .footer-info ion-icon {
      color: #e3350d;
      vertical-align: middle;
    }
    
    .footer-info a {
      color: #3880ff;
      text-decoration: none;
    }
    
    /* Responsividade */
    @media (min-width: 768px) {
      .action-buttons {
        flex-direction: row;
      }
      
      .button-container {
        width: 50%;
      }
    }
    
    @media (max-width: 480px) {
      .welcome-title {
        font-size: 1.8rem;
      }
      
      .welcome-text {
        font-size: 1rem;
      }
      
      .welcome-card {
        padding: 20px;
      }
      
      .main-button,
      .secondary-button {
        height: 56px;
        font-size: 1rem;
      }
      
      .button-text {
        font-size: 1rem;
      }
      
      .feature-item {
        min-width: 80px;
        font-size: 0.9rem;
      }
    }
    
    /* Melhorias para telas muito pequenas */
    @media (max-width: 360px) {
      .welcome-title {
        font-size: 1.5rem;
      }
      
      .button-text {
        font-size: 0.9rem;
      }
      
      .main-button,
      .secondary-button {
        height: 50px;
      }
      
      .pokemon-mascot {
        width: 100px;
      }
      
      .pokemon-logo {
        max-width: 180px;
      }
    }
    
    /* Melhorias para telas muito grandes */
    @media (min-width: 1200px) {
      .welcome-card {
        max-width: 800px;
      }
      
      .welcome-title {
        font-size: 2.5rem;
      }
      
      .welcome-text {
        font-size: 1.2rem;
      }
      
      .button-text {
        font-size: 1.3rem;
      }
      
      .main-button,
      .secondary-button {
        height: 70px;
      }
    }
    
    /* Ajustes para orientação paisagem em dispositivos móveis */
    @media (max-height: 600px) and (orientation: landscape) {
      .home-container {
        padding: 10px;
      }
      
      .pokemon-mascot {
        width: 80px;
      }
      
      .welcome-card {
        padding: 15px;
        margin-bottom: 20px;
      }
      
      .welcome-title {
        margin-bottom: 10px;
      }
      
      .welcome-text {
        margin-bottom: 15px;
      }
      
      .action-buttons {
        margin-top: 20px;
        flex-direction: row;
        gap: 15px;
      }
      
      .features-list {
        margin-bottom: 15px;
      }
      
      .footer-info {
        padding-top: 10px;
      }
    }
  `]
})
export class Home implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log('Home component initialized');
  }
} 