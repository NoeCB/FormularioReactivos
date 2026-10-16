import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { fechaNoFuturaValidator } from './validadores';

/**
 * Envoltorio en forma de directiva del validador `fechaNoFuturaValidator`.
 *
 * En los formularios reactivos el validador se pasa como función al crear el
 * control. En los template-driven la validación se declara en el HTML, así que
 * hace falta exponer la misma lógica como directiva y registrarla en
 * NG_VALIDATORS. La regla de negocio no se duplica: ambas rutas llaman a la
 * misma función.
 */
@Directive({
  selector: '[appFechaNoFutura]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FechaNoFuturaDirective,
      multi: true,
    },
  ],
})
export class FechaNoFuturaDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return fechaNoFuturaValidator(control);
  }
}