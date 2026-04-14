import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  isInternal: boolean; // Para saber si usar routerLink o href
  buttonText?: string; // Texto personalizado para el botón
}

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent {
  projects: Project[] = [
    {
      title: 'Dental Center BGA',
      description: 'Plataforma corporativa para el sector salud, implementación end-to-end. Integra diseño basado en CMS, gestión completa de infraestructura (DNS/Hosting) y optimización continua del rendimiento.',
      image: 'images/dentalcenter.webp',
      link: 'https://dentalcenterbga.com/',
      tags: ['WordPress', 'SEO', 'Gestión DNS/Hosting'],
      isInternal: false
    },
    {
      title: 'Tech News Hub (AI)',
      description: 'Curador inteligente de noticias tecnológicas. Orquesta servicios entre APIs con Node.js. Integra modelos de Gemini para selección, categorización y síntesis de contenido en español proveniente de HackerNews. Implementa workflows con GitHub Actions para garantizar actualizaciones diarias autónomas.',
      image: 'images/techNews.webp', // Sugiero capturar un pantallazo luego
      link: '/tech-news',
      tags: ['Gen IA', 'Node.js', 'Orquestación APIs'],
      isInternal: true
    },
    {
      title: 'Dashboard Financiero TRM',
      description: 'Dashboard de análisis y visualización de indicadores financieros. Consume APIs de datos gubernamentales abiertos para procesar series históricas, utilizando ECharts para la generación de gráficos interactivos',
      image: 'images/dashboardDolar.webp', 
      link: '/dolar-dashboard',
      tags: ['API Rest', 'ECharts', 'Visualización de Datos'],
      isInternal: true
    },
    {
      title: 'Ingrama Codebase',
      description: 'Plataforma profesional con arquitectura Angular y principios de Clean Code. Implementa una pipeline de CI/CD mediante GitHub Actions que automatiza el despliegue tras el merge con la rama main, permitiendo un flujo de desarrollo controlado en la rama develop para asegurar la integridad del código.',
      image: 'images/ingrama.webp', // Puedes usar tu foto o un icono de código
      link: 'https://github.com/rama8810/miPagAngular', // Reemplaza con tu URL real
      tags: ['Angular', 'CI/CD', 'Clean Code', 'GitHub'],
      isInternal: false,
      buttonText: 'Explorar Repositorio'
    }
  ];
}
