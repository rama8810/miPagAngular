import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    {
    path: '',
    component: HomeComponent,
    title: 'Rodolfo Andrés Meléndez Ardila | ingrama.co'
  },
    {
    path: 'dolar-dashboard',
    title: 'Comportamiento USD/COP | ingrama.co',
    loadComponent: () => import('./features/exchange-dashboard/exchange-dashboard.component').then(m => m.ExchangeDashboardComponent)
  },
    {
    path: 'tech-news',
    title: 'Tech News | ingrama.co',
    loadComponent: () => import('./features/tech-news/tech-news.component').then(m => m.TechNewsComponent)
  }
];