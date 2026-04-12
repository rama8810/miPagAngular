import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { HeaderComponent } from '../../core/header/header.component';
import { AboutComponent } from '../about/about.component';
import { KnowledgeComponent } from '../knowledge/knowledge.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent,
    HeaderComponent,
    AboutComponent,
    KnowledgeComponent,
    PortfolioComponent,
    ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
