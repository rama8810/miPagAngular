import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { HackerNewsService, HNItem } from '../../core/services/hacker-news.service';

@Component({
  selector: 'app-tech-news',
  imports: [CommonModule, RouterLink],
  templateUrl: './tech-news.component.html',
  styleUrl: './tech-news.component.css',
})
export class TechNewsComponent implements OnInit {
  private hnService = inject(HackerNewsService);
  
  // Observable que contendrá nuestras noticias
  news$: Observable<HNItem[]> | undefined;

  ngOnInit(): void {
    // Solicitamos el Top 15 de noticias al inicializar el componente
    this.news$ = this.hnService.getTopStories(15);
  }
}
