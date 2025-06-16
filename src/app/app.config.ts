import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      IonicModule.forRoot({
        mode: 'ios',
        scrollAssist: true,
        scrollPadding: false,
        swipeBackEnabled: true,
        animated: true,
        rippleEffect: false,
        inputShims: true
      })
    ),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
};
