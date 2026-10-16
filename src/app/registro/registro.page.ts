import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
  IonToast,
  IonNote,
  IonDatetime,
  IonModal,
} from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSpinner,
    IonToast,
    IonNote,
    IonDatetime,
    IonModal,
  ],
})
export class RegistroPage {
  private fb = inject(FormBuilder);

  // Formulario reactivo para el alta de productos de inventario
  public inventarioForm: FormGroup;

  // Signal que gestiona el estado de envío (loader / desactivar formulario)
  public isSubmitting = signal<boolean>(false);

  // Signal que controla la visibilidad del ion-toast de confirmación
  public toastAbierto = signal<boolean>(false);

  // Categorías disponibles para el ion-select
  public categorias = ['Electrónica', 'Herramientas', 'Consumibles'];

  constructor() {
    this.inventarioForm = this.fb.group({
      // Código de barras (SKU): obligatorio, exactamente 12 caracteres alfanuméricos
      sku: ['', [Validators.required, skuValidator]],
      // Nombre del producto: obligatorio
      nombre: ['', [Validators.required]],
      // Categoría: obligatoria, seleccionada de un desplegable
      categoria: ['', [Validators.required]],
      // Stock mínimo: obligatorio, numérico y mayor que 0
      stockMinimo: [
        null,
        [Validators.required, Validators.min(1)],
      ],
      // Fecha de nacimiento: obligatoria, seleccionada con el calendario
      fechaNacimiento: ['', [Validators.required]],
    });
  }

  // Fecha máxima seleccionable en el calendario (hoy, en formato ISO yyyy-MM-dd)
  public fechaMaxima = new Date().toISOString().split('T')[0];

  // Getter de conveniencia para acceder a los controles desde la plantilla
  get f() {
    return this.inventarioForm.controls;
  }

  // Handler del calendario: guarda el valor en el control reactivo
  public onFechaChange(event: CustomEvent): void {
    const valor = (event.detail as { value?: string | string[] }).value;
    const fecha = Array.isArray(valor) ? valor[0] : valor ?? '';
    this.inventarioForm.get('fechaNacimiento')?.setValue(fecha);
    this.inventarioForm.get('fechaNacimiento')?.markAsTouched();
  }

  // Devuelve la fecha seleccionada en formato legible (dd/mm/aaaa) para el input
  public fechaFormateada(): string {
    const valor: string = this.f['fechaNacimiento'].value;
    if (!valor) {
      return '';
    }
    const fecha = new Date(valor);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.inventarioForm.invalid) {
      this.inventarioForm.markAllAsTouched(); // Fuerza la visualización de errores
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formData = this.inventarioForm.value;
      console.log('Producto a guardar (payload):', formData);

      // Simulación de una petición de guardado local (async)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Confirmación de guardado mediante ion-toast
      this.toastAbierto.set(true);

      this.inventarioForm.reset();
    } catch (error) {
      console.error('Error al guardar el producto', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

/**
 * Validador personalizado para el código de barras (SKU).
 * Exige exactamente 12 caracteres alfanuméricos (A-Z, a-z, 0-9).
 */
function skuValidator(control: import('@angular/forms').AbstractControl) {
  const valor: string = control.value ?? '';
  if (!valor) {
    return null; // El required se encarga del campo vacío
  }
  const esValido = /^[A-Za-z0-9]{12}$/.test(valor);
  return esValido ? null : { sku: true };
}
