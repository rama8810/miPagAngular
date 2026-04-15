import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';

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
export class HomeComponent implements AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller
  ) {}

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment: string | null) => {
      if (fragment) {
        setTimeout(() => {
          this.viewportScroller.scrollToAnchor(fragment);
        }, 150);
      }
    });
  }
}
