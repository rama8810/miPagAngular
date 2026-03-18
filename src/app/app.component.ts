import { Component, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';

import { HeaderComponent } from './core/header/header.component';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { KnowledgeComponent } from './features/knowledge/knowledge.component';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { ContactComponent } from './features/contact/contact.component';
import { FooterComponent } from './core/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, HeroComponent, AboutComponent, KnowledgeComponent, PortfolioComponent, ContactComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('Rodolfo Andrés Meléndez Ardila');
  // 2. Inyecta el servicio en el constructor y establece el margen
  constructor(private viewportScroller: ViewportScroller) {
    // El formato es [X, Y]. Le decimos: 0 desplazamiento horizontal, 50px vertical.
    // (Ajusta el 50 por el alto de tu menú negro)
    this.viewportScroller.setOffset([0, 50]); 
  }
}