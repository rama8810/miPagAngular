import { Component, signal } from '@angular/core';
import { HeaderComponent } from './core/header/header.component';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { KnowledgeComponent } from './features/knowledge/knowledge.component';
import { ContactComponent } from './features/contact/contact.component';
import { FooterComponent } from './core/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, HeroComponent, AboutComponent, KnowledgeComponent, ContactComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('miPagAngular');
}