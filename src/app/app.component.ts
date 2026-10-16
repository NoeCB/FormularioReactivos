import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // Se inyecta para que el servicio se instancie y aplique el tema guardado
  // antes de que se pinte la primera página.
  private tema = inject(ThemeService);
}