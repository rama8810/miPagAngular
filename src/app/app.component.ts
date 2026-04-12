import { Component, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('Rodolfo Andrés Meléndez Ardila');
  // 2. Inyecta el servicio en el constructor y establece el margen
  constructor(private viewportScroller: ViewportScroller) {
    // El formato es [X, Y]. Le decimos: 0 desplazamiento horizontal, 50px vertical.
    // (Ajusta el 50 por el alto de tu menú negro)
    this.viewportScroller.setOffset([0, 50]); 
  }
}