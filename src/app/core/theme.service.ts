import { Injectable, signal } from '@angular/core';

const CLAVE_TEMA = 'tema-preferido';
const CLASE_OSCURA = 'ion-palette-dark';

/**
 * Gestiona el tema de la aplicación (oscuro / claro).
 *
 * El tema se aplica añadiendo o quitando la clase `ion-palette-dark` en el
 * elemento raíz. Para que esto funcione, global.scss debe importar
 * `dark.class.css` y no `dark.system.css`: esta última obedece a la
 * preferencia del sistema operativo e impide el cambio manual.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _oscuro = signal<boolean>(true);

  /** Cierto cuando la aplicación está en modo oscuro. */
  readonly oscuro = this._oscuro.asReadonly();

  constructor() {
    const inicial = this.leerPreferencia();
    this._oscuro.set(inicial);
    this.aplicar(inicial);
  }

  /** Cambia de oscuro a claro y viceversa, recordando la elección. */
  alternar(): void {
    const nuevo = !this._oscuro();
    this._oscuro.set(nuevo);
    this.aplicar(nuevo);
    this.guardarPreferencia(nuevo);
  }

  private aplicar(oscuro: boolean): void {
    document.documentElement.classList.toggle(CLASE_OSCURA, oscuro);
  }

  private leerPreferencia(): boolean {
    try {
      const guardado = localStorage.getItem(CLAVE_TEMA);
      if (guardado === 'claro') {
        return false;
      }
      if (guardado === 'oscuro') {
        return true;
      }
    } catch {
      // localStorage puede estar bloqueado: se sigue solo en memoria.
    }
    return true; // Sin preferencia previa se arranca en oscuro.
  }

  private guardarPreferencia(oscuro: boolean): void {
    try {
      localStorage.setItem(CLAVE_TEMA, oscuro ? 'oscuro' : 'claro');
    } catch {
      // Sin persistencia disponible; el tema sigue aplicándose en la sesión.
    }
  }
}