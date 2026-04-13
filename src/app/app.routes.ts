import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    {
    path: '',
    component: HomeComponent,
    title: 'Ingrama | Portafolio'
  },
    {
    path: 'dolar-dashboard',
    title: 'Comportamiento USD/COP | Ingrama',
    loadComponent: () => import('./features/exchange-dashboard/exchange-dashboard.component').then(m => m.ExchangeDashboardComponent)
  },
    {
    path: 'tech-news',
    title: 'Tech News | Ingrama',
    loadComponent: () => import('./features/tech-news/tech-news.component').then(m => m.TechNewsComponent)
  }
];