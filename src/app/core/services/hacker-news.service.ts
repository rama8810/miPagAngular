import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Contrato de datos enriquecido por la IA
export interface NoticiaIA {
  id: number;
  url: string;
  score: number;
  time: number;
  titulo_es: string;
  resumen: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root',
})
export class HackerNewsService {
  private http = inject(HttpClient);

  /**
   * Obtiene las noticias curadas por el agente de IA.
   * Ya no necesita 'limit' porque el JSON ya viene pre-filtrado con lo mejor.
   */
  getTopStories(): Observable<NoticiaIA[]> {
    // Leemos directamente el activo generado en el build
    return this.http.get<NoticiaIA[]>('assets/data/news.json');
  }
}