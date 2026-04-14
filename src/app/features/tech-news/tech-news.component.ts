import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HackerNewsService, NoticiaIA } from '../../core/services/hacker-news.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser'; // Importación correcta

@Component({
  selector: 'app-tech-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tech-news.component.html',
  styleUrls: ['./tech-news.component.css']
})
export class TechNewsComponent implements OnInit {
  // Inyectamos cada servicio por separado (Clean Code)
  private hnService = inject(HackerNewsService);
  private titleService = inject(Title);

  news$!: Observable<NoticiaIA[]>;

  ngOnInit(): void {
    this.news$ = this.hnService.getTopStories();
    
    // Ahora this.titleService sí existe y funciona
    this.titleService.setTitle(`Tech News Hub | ${new Date().toLocaleDateString()}`);
  }
}