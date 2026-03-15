import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-knowledge',
  imports: [NgCircleProgressModule],
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.css',
})
export class KnowledgeComponent implements OnInit, OnDestroy{
  isVisible = false;
  private observer: IntersectionObserver | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Detectamos si es una pantalla móvil (menor a 768px)
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // Definimos el umbral: 0.2 para móvil, 0.5 para desktop
  const thresholdValue = isMobile ? 0.1 : 0.5;

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
        } else {
          this.isVisible = false;
        }
      });
    }, { threshold: thresholdValue });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}