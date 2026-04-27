import { Component, ElementRef, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-knowledge',
  imports: [NgCircleProgressModule],
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.css',
})
export class KnowledgeComponent implements OnInit, OnDestroy {
  // Bandera de estado reactivo: Notifica a la vista cuándo renderizar la animación.
  isVisible = false;

  // Se tipa como undefined inicialmente para evitar errores de instanciación temprana 
  // antes de confirmar el entorno de ejecución (Navegador vs Servidor).
  private observer: IntersectionObserver | undefined;

  constructor(
    // ElementRef: Referencia directa al nodo del DOM de este componente anfitrión.
    private el: ElementRef,

    // PLATFORM_ID: Token inyectado para identificar de forma segura el entorno de ejecución actual.
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // [Arquitectura SSR] - Zona de ejecución segura: 
    // Protege el proceso de Server-Side Rendering (Node.js). Si Node.js intenta ejecutar 
    // "window" o "IntersectionObserver", la compilación colapsará.
    if (isPlatformBrowser(this.platformId)) {

      // [UI/UX] - Adaptación de la geometría visual:
      // Identifica si el usuario está en móvil mediante la API nativa de media queries.
      const isMobile = window.matchMedia('(max-width: 768px)').matches;

      // Cálculo dinámico del umbral (Threshold):
      // - Móviles (0.2 / 20%): Exige menos área visible ya que las pantallas son pequeñas. 
      //   Evita que el componente se quede "congelado" si es más alto que la pantalla del celular.
      // - Escritorio (0.4 / 40%): Retrasa la animación hasta que el contenedor esté bien 
      //   posicionado en el monitor, maximizando el impacto visual.
      const thresholdValue = isMobile ? 0.2 : 0.4;

      // [Rendimiento] - Delegación de eventos:
      // Se utiliza IntersectionObserver en lugar de capturar eventos de scroll (ej. @HostListener).
      // Esto traslada la carga de cálculo al navegador de forma asíncrona, manteniendo 
      // el hilo principal (Main Thread) libre y evitando caídas de fotogramas (FPS).
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
        });
      }, { threshold: thresholdValue });

      // Comienza a vigilar los cambios de intersección estrictamente sobre el elemento <app-knowledge>.
      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    // [Clean Code] - Prevención de fugas de memoria (Memory Leaks):
    // Es imperativo desconectar el observador cuando el usuario cambia de ruta o el componente 
    // se destruye. Si no se limpia, el navegador seguirá intentando evaluar las posiciones 
    // de un elemento fantasma que ya no existe en el DOM.
    if (isPlatformBrowser(this.platformId)) {
      this.observer?.disconnect();
    }
  }
}