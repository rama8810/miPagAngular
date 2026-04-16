import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExchangeApiService, TrmHistorica } from '../../core/services/exchange-api.service';
import { Observable, map } from 'rxjs';
import { Subject } from 'rxjs';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

interface DashboardViewModel {
  historico: TrmHistorica[];
  tasaActual: number;
  variacionUltimoDia: number;
  vigenciaDesde: string;
  vigenciaHasta: string;
  chartOptions: EChartsOption;
  emaActual: number | null;
  momentumActual: number | null;
  volatilidadActual: number | null;
  estadoTendencia: string;
  estadoVolatilidad: string;
  esAlza: boolean;
  emaAyer: number | null;
  detallesEma: { precioHoy: number, k: number, emaAyer: number } | null;
  detallesVolatilidad: { media20d: number, n: number } | null;
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

  private zoomSubject = new Subject<EChartsOption>();
  zoomUpdate$: Observable<EChartsOption> = this.zoomSubject.asObservable();

  dashboardData$: Observable<DashboardViewModel> = this.apiService.getHistoricoTrm().pipe(
    map(historico => {
      this.datosCargados = historico;
      this.fechaMinima = historico[0].fechaDesde; 
      this.fechaMaxima = historico[historico.length - 1].fechaHasta;
      
      if (!this.fechaSeleccionadaInicio) {
        this.fechaSeleccionadaInicio = this.fechaMinima;
        this.fechaSeleccionadaFin = this.fechaMaxima;
      }

      const fechas = historico.map(item => item.fechaDesde);
      const valores = historico.map(item => item.valor);

      // --- INICIO CÁLCULOS MATEMÁTICOS ---
      const ema20 = this.calcularEMA(valores, 20);
      const momentum = this.calcularMomentum(ema20);
      const bollinger = this.calcularBandasBollinger(valores, 20);

      const indiceActual = historico.length - 1;
      const tasaActual = valores[indiceActual];
      const tasaAyer = valores[indiceActual - 1];
      
      const emaActual = ema20[indiceActual];
      const emaAyer = ema20[indiceActual - 1];
      const momentumActual = momentum[indiceActual];
      const prevMomentum = momentum[indiceActual - 1];
      const volatilidadActual = bollinger.stdDev[indiceActual];

      // Lógica de Tendencia (Pedal del acelerador)
      let estadoTendencia = 'Neutral';
      if (momentumActual !== null && prevMomentum !== null) {
        if (momentumActual > 0) {
          estadoTendencia = momentumActual > prevMomentum ? 'Aceleración Alcista' : 'Desaceleración Alcista';
        } else {
          estadoTendencia = momentumActual < prevMomentum ? 'Aceleración Bajista' : 'Desaceleración Bajista';
        }
      }
      
      // Evaluación del estado de la Volatilidad (Basado en comportamiento USD/COP)
      let estadoVolatilidad = 'Normal';
      if (volatilidadActual !== null) {
        if (volatilidadActual > 50) {
          estadoVolatilidad = 'Alta (Errático)';
        } else if (volatilidadActual < 20) {
          estadoVolatilidad = 'Baja (Calma)';
        } else {
          estadoVolatilidad = 'Normal (Estable)';
        }
      }
      
      // Determinamos si es Alza o Baja para los colores del fondo
      const esAlza = (momentumActual || 0) >= 0;
      // --- FIN CÁLCULOS MATEMÁTICOS ---


      // --- EXTRACCIÓN DE DATOS PARA TRANSPARENCIA MATEMÁTICA ---
      const kEma = 2 / (20 + 1); // Multiplicador a 20 días
      const ventana20d = valores.slice(indiceActual - 20 + 1, indiceActual + 1);
      const media20d = ventana20d.reduce((a, b) => a + b, 0) / 20;

      const detallesEma = emaAyer !== null ? { 
        precioHoy: tasaActual, 
        k: kEma, 
        emaAyer: emaAyer 
      } : null;

      const detallesVolatilidad = { media20d, n: 20 };
      // --- FIN EXTRACCIÓN ---


      const chartOptions: EChartsOption = {
        tooltip: { trigger: 'axis' },
        legend: { 
          data: ['TRM (Bruta)', 'Tendencia (EMA 20)', 'Volatilidad (Techo)', 'Volatilidad (Suelo)'],
          top: 0,
          left: 'center',
          type: 'scroll',
          padding: [5, 0, 0, 0] 
        },
        grid: { top: 50, left: '6%', right: '12%', bottom: '16%', containLabel: true },
        dataZoom: [
          { type: 'slider', show: true, start: 90, end: 100, left: '2%', right: '2%', bottom: '1%' },
          { type: 'inside', start: 90, end: 100 }
        ],
        xAxis: { 
          type: 'category', 
          boundaryGap: false, 
          data: fechas, 
          axisLabel: { showMaxLabel: true } 
        },
        yAxis: { type: 'value', scale: true, axisLabel: { formatter: '${value}' } },
        series: [
          {
            name: 'TRM (Bruta)', type: 'line', data: valores, smooth: false,
            lineStyle: { width: 2, color: '#007bff', type: 'solid' },
            itemStyle: { color: '#007bff' },
            symbol: 'none'
          },
          {
            name: 'Tendencia (EMA 20)', type: 'line', data: ema20 as number[], smooth: true,
            lineStyle: { width: 3, color: '#ffc107', type: 'solid' },
            itemStyle: { color: '#ffc107' },
            symbol: 'none'
          },
          {
            name: 'Volatilidad (Techo)', type: 'line', data: bollinger.upper as number[], smooth: true,
            lineStyle: { width: 1, color: '#dc3545', type: 'dashed' },
            itemStyle: { color: '#dc3545' },
            symbol: 'none'
          },
          {
            name: 'Volatilidad (Suelo)', type: 'line', data: bollinger.lower as number[], smooth: true,
            lineStyle: { width: 1, color: '#28a745', type: 'dashed' },
            itemStyle: { color: '#28a745' },
            symbol: 'none'
          }
        ]
      };

      return {
        historico,
        tasaActual,
        variacionUltimoDia: tasaActual - tasaAyer,
        vigenciaDesde: historico[indiceActual].fechaDesde,
        vigenciaHasta: historico[indiceActual].fechaHasta,
        chartOptions,
        emaActual,
        momentumActual,
        volatilidadActual,
        estadoTendencia,
        estadoVolatilidad,
        esAlza,
        emaAyer,
        detallesEma,
        detallesVolatilidad
      };
    })
  );

  actualizarRangoPorFecha(fechaInicio: string, fechaFin: string) {
    if (!fechaInicio || !fechaFin) return;
    this.fechaSeleccionadaInicio = fechaInicio;
    this.fechaSeleccionadaFin = fechaFin;

    const startIdx = this.datosCargados.findIndex(d => d.fechaDesde >= fechaInicio);
    const endIdx = this.datosCargados.findIndex(d => d.fechaDesde >= fechaFin);

    if (startIdx !== -1 && endIdx !== -1) {
      const startPct = (startIdx / this.datosCargados.length) * 100;
      const endPct = (endIdx / this.datosCargados.length) * 100;

      this.zoomSubject.next({
        dataZoom: [
          { type: 'slider', show: true, start: startPct, end: endPct },
          { type: 'inside', start: startPct, end: endPct }
        ]
      });
    }
  }

  // --- MÉTODOS PRIVADOS DE INGENIERÍA FINANCIERA ---

  private calcularEMA(precios: number[], periodos: number): (number | null)[] {
    const k = 2 / (periodos + 1);
    const ema: (number | null)[] = [];
    let smaInicial = 0;
    
    for (let i = 0; i < precios.length; i++) {
      if (i < periodos - 1) {
        smaInicial += precios[i];
        ema.push(null); 
      } else if (i === periodos - 1) {
        smaInicial += precios[i];
        ema.push(smaInicial / periodos);
      } else {
        const emaAnterior = ema[i - 1] as number;
        ema.push(precios[i] * k + emaAnterior * (1 - k));
      }
    }
    return ema;
  }

  private calcularMomentum(ema: (number | null)[]): (number | null)[] {
    const momentum: (number | null)[] = [];
    for (let i = 0; i < ema.length; i++) {
      if (i === 0 || ema[i] === null || ema[i - 1] === null) {
        momentum.push(null);
      } else {
        momentum.push((ema[i] as number) - (ema[i - 1] as number));
      }
    }
    return momentum;
  }

  private calcularBandasBollinger(precios: number[], periodos: number, k: number = 2): { upper: (number | null)[], lower: (number | null)[], stdDev: (number | null)[] } {
    const upper: (number | null)[] = [];
    const lower: (number | null)[] = [];
    const stdDevArr: (number | null)[] = [];

    for (let i = 0; i < precios.length; i++) {
      if (i < periodos - 1) {
        upper.push(null); lower.push(null); stdDevArr.push(null);
        continue;
      }
      const ventana = precios.slice(i - periodos + 1, i + 1);
      const media = ventana.reduce((a, b) => a + b, 0) / periodos;
      const varianza = ventana.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / periodos;
      const stdDev = Math.sqrt(varianza);
      
      stdDevArr.push(stdDev);
      upper.push(media + (stdDev * k));
      lower.push(media - (stdDev * k));
    }
    return { upper, lower, stdDev: stdDevArr };
  }
}