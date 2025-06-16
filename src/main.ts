import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Adiciona um listener para quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error('Error bootstrapping application:', err));
});
