import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// 1. Definimos el contrato de datos exacto que nos entrega la API
export interface HNItem {
  id: number;
  title: string;
  url: string;
  by: string;      // Autor
  time: number;    // Fecha en formato Unix Timestamp
  score: number;   // Puntos/Votos
  type: string;    // 'story', 'comment', etc.
}

@Injectable({
  providedIn: 'root',
})
export class HackerNewsService {
  private http = inject(HttpClient);
  
  // URL base oficial de la API de Y Combinator (Firebase)
  private readonly API_URL = 'https://hacker-news.firebaseio.com/v0';

  /**
   * Obtiene las noticias principales más populares.
   * @param limit Cantidad de noticias a traer (Por defecto 10 para no saturar la red)
   * @returns Observable con el arreglo de noticias ya hidratadas con sus detalles
   */
  getTopStories(limit: number = 10): Observable<HNItem[]> {
    // Paso 1: Pedimos el arreglo gigante de IDs (ej: [400123, 400124, 400125...])
    return this.http.get<number[]>(`${this.API_URL}/topstories.json`).pipe(
      
      // Recortamos el arreglo para tomar solo los primeros 'limit' IDs
      map(ids => ids.slice(0, limit)),
      
      // Paso 2: Interceptamos ese arreglo recortado y cambiamos de flujo (switchMap)
      switchMap(ids => {
        // Por cada ID, preparamos una petición HTTP individual
        const peticionesIndividuales = ids.map(id => 
          this.http.get<HNItem>(`${this.API_URL}/item/${id}.json`)
        );
        
        // forkJoin dispara todas las peticiones AL MISMO TIEMPO y espera a que la última termine.
        // Nos devuelve un arreglo perfecto y ordenado del tipo HNItem[].
        return forkJoin(peticionesIndividuales);
      })
    );
  }
}
