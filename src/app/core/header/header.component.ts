import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Esta variable controlará qué enlace tiene la clase 'active'
  activeSection: string = 'begin';

  // @HostListener reemplaza a tu antiguo window.onscroll
  @HostListener('window:scroll')
  onWindowScroll() {
    const sections = ['begin', 'aboutMe', 'knowledge', 'portfolio', 'contact'];
    const scrollPosition = window.scrollY + 150; // Mismo offset que tenías en tu script original

    for (let section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offset = element.offsetTop;
        const height = element.offsetHeight;

        // Si el scroll está dentro de los límites de esta sección, actualizamos la variable
        if (scrollPosition >= offset && scrollPosition < offset + height) {
          this.activeSection = section;
        }
      }
    }
  }
  // Por defecto, en celulares el menú empieza colapsado (escondido)
  isMenuCollapsed = true;

  // Esta función invierte el estado (si está abierto lo cierra, y viceversa)
  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  // Esta función fuerza el cierre (útil para cuando el usuario hace clic en un link)
  closeMenu() {
    this.isMenuCollapsed = true;
  }
}