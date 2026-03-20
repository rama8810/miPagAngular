import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    importProvidersFrom(
      NgCircleProgressModule.forRoot({
        // --- Dimensiones ---
        radius: 55,
        outerStrokeWidth: 15,
        innerStrokeWidth: 15,

        //Superposición
        space: -15, // Espacio entre el círculo exterior e interior (negativo para superponer)

        // --- Colores ---
        outerStrokeColor: '#2d6d92',
        innerStrokeColor: 'Silver',
        titleColor: '#333333',
        unitsColor: '#333333',

        // --- Tipografía ---
        titleFontSize: '30',
        unitsFontSize: '30',
        titleFontWeight: 'normal',

        // --- Estética y Comportamiento ---
        outerStrokeLinecap: 'round', // Angular lo pone redondeado por defecto
        showSubtitle: false,
        showInnerStroke: true,
        startFromZero: true,
        animation: true,
        animationDuration: 1000, // Duración de la animación en milisegundos
      }),
    ),
    provideClientHydration(withEventReplay()),
  ],
};
