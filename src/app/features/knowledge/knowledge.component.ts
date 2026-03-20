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
  isVisible = false;
  private observer: IntersectionObserver | undefined;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Zona de ejecución segura: Aísla las APIs nativas del motor Node.js
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const thresholdValue = isMobile ? 0.2 : 0.5;

      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
        });
      }, { threshold: thresholdValue });

      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    // Prevención de fugas de memoria (Memory Leaks) al destruir el componente en el cliente
    if (isPlatformBrowser(this.platformId)) {
      this.observer?.disconnect();
    }
  }
}