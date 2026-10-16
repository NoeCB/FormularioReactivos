import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Impide que la fecha indicada sea posterior al día de hoy.
 *
 * Devuelve null cuando el control está vacío: de ese caso se encarga
 * Validators.required, para que no se acumulen dos errores por lo mismo.
 */
export function fechaNoFuturaValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string | null;
  if (!valor) {
    return null;
  }

  const elegida = new Date(valor);
  if (Number.isNaN(elegida.getTime())) {
    return { fechaInvalida: true };
  }

  // Se compara contra el final del día actual para que hoy se considere válido
  // independientemente de la hora que arrastre el valor.
  const finDeHoy = new Date();
  finDeHoy.setHours(23, 59, 59, 999);

  return elegida.getTime() > finDeHoy.getTime() ? { fechaFutura: true } : null;
}