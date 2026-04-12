import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface SocrataTrmResponse {
  valor: string;
  vigenciadesde: string;
  vigenciahasta: string;
}

export interface TrmHistorica {
  fechaDesde: string;
  fechaHasta: string;
  valor: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExchangeApiService {
  private http = inject(HttpClient);
  
  // Endpoint oficial de la TRM. Traemos los últimos 15 días ordenados por fecha descendente.
  private apiUrl = 'https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=10000&$order=vigenciadesde DESC';

  getHistoricoTrm(): Observable<TrmHistorica[]> {
    return this.http.get<SocrataTrmResponse[]>(this.apiUrl).pipe(
      map(data => {
        const historicoLimpio = data.map(item => ({
          fechaDesde: item.vigenciadesde.split('T')[0],
          fechaHasta: item.vigenciahasta.split('T')[0],
          valor: parseFloat(item.valor)
        }));
        // Invertimos para orden cronológico (útil para gráficas)
        return historicoLimpio.reverse();
      })
    );
  }
}
