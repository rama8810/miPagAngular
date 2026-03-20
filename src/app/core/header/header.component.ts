import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // 1. Estado visual del menú y secciones (Requerido por header.component.html)
  activeSection: string = 'begin';
  isMenuCollapsed: boolean = true;
  isScrolled: boolean = false;

  // 2. Inyección estricta de dependencias para aislar la manipulación del DOM
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document 
  ) {}

  // 3. Método del botón hamburguesa (Ejecución exclusiva del cliente)
  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  // 4. Cierre del menú con protección de plataforma
  closeMenu(): void {
    this.isMenuCollapsed = true;
    
    // Zona Segura: El servidor ignorará esta manipulación del DOM
    if (isPlatformBrowser(this.platformId)) {
      const navbarCollapse = this.document.getElementById('navbarSupportedContent');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    }
  }

  // 5. Escucha del Scroll dinámico con protección isomórfica
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Zona Segura: Node.js no ejecuta eventos de scroll, pero se protege preventivamente
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 50;

      // Lógica de detección de sección activa para el menú
      const sections = ['begin', 'aboutMe', 'knowledge', 'portfolio', 'contact'];
      let currentSection = this.activeSection;

      for (const section of sections) {
        const element = this.document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Calcula si la sección está en la parte superior del viewport
          if (rect.top <= 150) { 
            currentSection = section;
          }
        }
      }
      this.activeSection = currentSection;
    }
  }
}