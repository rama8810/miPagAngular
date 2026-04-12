import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExchangeApiService, TrmHistorica } from '../../core/services/exchange-api.service';
import { Observable, map } from 'rxjs';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

export interface Racha {
  tipo: 'alza' | 'baja';
  dias: number;
  fechaInicio: string;
  fechaFin: string;
  precioInicial: number;
  precioFinal: number;
}

interface DashboardViewModel {
  historico: TrmHistorica[];
  tasaActual: number;
  variacionUltimoDia: number;
  vigenciaDesde: string;
  vigenciaHasta: string;
  chartOptions: EChartsOption;
  rachaActual: Racha | null;
  topRachasAlza: Racha[];
  topRachasBaja: Racha[];
}

@Component({
  selector: 'app-exchange-dashboard',
  imports: [CommonModule, RouterLink, NgxEchartsDirective],
  templateUrl: './exchange-dashboard.component.html',
  styleUrl: './exchange-dashboard.component.css',
})

export class ExchangeDashboardComponent {
  Math = Math; // Exponemos Math para usar Math.abs() en el HTML
  private apiService = inject(ExchangeApiService);
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  fechaMinima: string = '';
  fechaMaxima: string = '';
  fechaSeleccionadaInicio: string = '';
  fechaSeleccionadaFin: string = '';
  private datosCargados: TrmHistorica[] = [];

  dashboardData$: Observable<DashboardViewModel> = this.apiService.getHistoricoTrm().pipe(
    map(historico => {
      // 1. Guardamos los datos intactos (del pasado al futuro, como ya los tenías)
      this.datosCargados = historico;

      // 2. Extraemos los límites globales para desbloquear el scroll del calendario
      // El índice 0 es el dato más antiguo (ej. 2015), el último índice es Hoy (ej. 2026)
      this.fechaMinima = historico[0].fechaDesde; 
      this.fechaMaxima = historico[historico.length - 1].fechaHasta;
      if (!this.fechaSeleccionadaInicio) {
        this.fechaSeleccionadaInicio = this.fechaMinima;
        this.fechaSeleccionadaFin = this.fechaMaxima;
      }

      // --- INICIO ALGORITMO DE RACHAS ---
      const todasLasRachas: Racha[] = [];
      let currentTipo: 'alza' | 'baja' | null = null;
      let startIdx = 0;

      // Recorremos los 4000 días para identificar cambios de tendencia
      for (let i = 1; i < historico.length; i++) {
        const diff = historico[i].valor - historico[i - 1].valor;
        if (diff === 0) continue; // Ignoramos días festivos o sin variación

        const tipoDia = diff > 0 ? 'alza' : 'baja';

        if (currentTipo === null) {
          currentTipo = tipoDia;
          startIdx = i - 1;
        } else if (currentTipo !== tipoDia) {
          // Cambio de tendencia: Guardamos la racha que acaba de terminar
          todasLasRachas.push({
            tipo: currentTipo,
            dias: i - 1 - startIdx,
            fechaInicio: historico[startIdx].fechaDesde,
            fechaFin: historico[i - 1].fechaHasta,
            precioInicial: historico[startIdx].valor, // <-- NUEVO
            precioFinal: historico[i - 1].valor
          });
          // Iniciamos la nueva racha
          currentTipo = tipoDia;
          startIdx = i - 1;
        }
      }

      // Capturamos la racha que está viva el día de hoy
      let rachaActual: Racha | null = null;
      if (currentTipo !== null) {
        rachaActual = {
          tipo: currentTipo,
          dias: (historico.length - 1) - startIdx,
          fechaInicio: historico[startIdx].fechaDesde,
          fechaFin: historico[historico.length - 1].fechaHasta,
          precioInicial: historico[startIdx].valor,
          precioFinal: historico[historico.length - 1].valor
        };
      }

      // Ordenamos todas las rachas de mayor a menor duración para sacar el Top Histórico
      const rachasOrdenadas = [...todasLasRachas].sort((a, b) => b.dias - a.dias);
      const topRachasAlza = rachasOrdenadas.filter(r => r.tipo === 'alza').slice(0, 3);
      const topRachasBaja = rachasOrdenadas.filter(r => r.tipo === 'baja').slice(0, 3);
      // --- FIN ALGORITMO DE RACHAS ---

      const indiceActual = historico.length - 1;
      const tasaActual = historico[indiceActual].valor;
      const tasaAyer = historico[indiceActual - 1].valor;
      const fechas = historico.map(item => item.fechaDesde);
      const valores = historico.map(item => item.valor);

      const chartOptions: EChartsOption = {
        tooltip: { trigger: 'axis' },
        grid: { left: '6%', right: '12%', bottom: '15%', containLabel: true },
        dataZoom: [
          { type: 'slider', show: true, start: 0, end: 100 },
          { type: 'inside', start: 0, end: 100 }
        ],
        xAxis: { 
          type: 'category', 
          boundaryGap: false, 
          data: fechas, 
          axisLabel: { 
            showMaxLabel: true 
          } 
        },
        yAxis: { type: 'value', scale: true, axisLabel: { formatter: '${value}' } },
        series: [{
          name: 'TRM', type: 'line', data: valores, smooth: true,
          lineStyle: { width: 3, color: '#0056b3' },
          itemStyle: { color: '#0056b3' },
          areaStyle: { opacity: 0.1, color: '#0056b3' }
        }]
      };

      return {
        historico,
        tasaActual,
        variacionUltimoDia: tasaActual - tasaAyer,
        vigenciaDesde: historico[indiceActual].fechaDesde,
        vigenciaHasta: historico[indiceActual].fechaHasta,
        chartOptions,
        rachaActual,   
        topRachasAlza, 
        topRachasBaja
      };
    })
  );
  // Método que ejecutará el botón del HTML
  actualizarRangoPorFecha(fechaInicio: string, fechaFin: string) {
    if (!fechaInicio || !fechaFin) return;
    this.fechaSeleccionadaInicio = fechaInicio;
    this.fechaSeleccionadaFin = fechaFin;

    const startIdx = this.datosCargados.findIndex(d => d.fechaDesde >= fechaInicio);
    const endIdx = this.datosCargados.findIndex(d => d.fechaDesde >= fechaFin);

    if (startIdx !== -1 && endIdx !== -1) {
      const startPct = (startIdx / this.datosCargados.length) * 100;
      const endPct = (endIdx / this.datosCargados.length) * 100;

      // Recreamos las opciones del gráfico dinámicamente
      this.dashboardData$ = this.dashboardData$.pipe(
        map(vm => ({
          ...vm,
          chartOptions: {
            ...vm.chartOptions,
            dataZoom: [
              { type: 'slider', show: true, start: startPct, end: endPct },
              { type: 'inside', start: startPct, end: endPct }
            ]
          }
        }))
      );
    }
  }
}
