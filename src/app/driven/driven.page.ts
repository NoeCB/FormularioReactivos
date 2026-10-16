import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline, swapHorizontalOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonIcon,
  IonSpinner,
  IonToast,
  IonNote,
  IonDatetime,
  IonModal,
  IonChip,
} from '@ionic/angular';
import { ThemeService } from '../core/theme.service';
import { FechaNoFuturaDirective } from '../core/fecha-no-futura.directive';
import { hashSha256 } from '../core/password.util';
import { formatearFecha } from '../core/fecha.util';

/** Modelo plano que respalda el formulario template-driven. */
interface ModeloRegistro {
  nombre: string;
  email: string;
  password: string;
  fechaNacimiento: string;
}

@Component({
  selector: 'app-driven',
  templateUrl: 'driven.page.html',
  styleUrls: ['driven.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FechaNoFuturaDirective,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    IonIcon,
    IonSpinner,
    IonToast,
    IonNote,
    IonDatetime,
    IonModal,
    IonChip,
  ],
})
export class DrivenPage {
  private tema = inject(ThemeService);

  /**
   * En el enfoque template-driven el estado vive en un objeto plano del
   * componente y Angular lo sincroniza con la vista mediante ngModel.
   * No hay FormGroup ni FormControl: la estructura la define el HTML.
   */
  public modelo: ModeloRegistro = {
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: '',
  };

  /** Expresión que exige 8 caracteres como mínimo, con letra y número. */
  public readonly patronPassword = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$';

  public isSubmitting = signal<boolean>(false);
  public toastAbierto = signal<boolean>(false);
  public toastMensaje = signal<string>('');
  public toastColor = signal<'success' | 'danger'>('success');
  public calendarioAbierto = signal<boolean>(false);

  public fechaMaxima = new Date().toISOString().split('T')[0];
  private valorFechaPrevio = '';

  constructor() {
    addIcons({ moonOutline, sunnyOutline, swapHorizontalOutline });
  }

  get temaOscuro(): boolean {
    return this.tema.oscuro();
  }

  alternarTema(): void {
    this.tema.alternar();
  }

  // --- Calendario -----------------------------------------------------------

  abrirCalendario(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.valorFechaPrevio = this.modelo.fechaNacimiento;
    this.calendarioAbierto.set(true);
  }

  aceptarFecha(formulario: NgForm): void {
    this.marcarFechaTocada(formulario);
    this.calendarioAbierto.set(false);
  }

  cancelarFecha(formulario: NgForm): void {
    this.modelo.fechaNacimiento = this.valorFechaPrevio;
    this.marcarFechaTocada(formulario);
    this.calendarioAbierto.set(false);
  }

  /**
   * Marca el control de fecha como tocado para que su mensaje de error se
   * muestre. En el enfoque reactivo basta con llamar a markAsTouched sobre el
   * control; aquí hay que pedírselo al FormGroup que ngForm mantiene por
   * detrás, porque el componente no tiene una referencia directa al control.
   */
  private marcarFechaTocada(formulario: NgForm): void {
    formulario.control.get('fechaNacimiento')?.markAsTouched();
  }

  fechaFormateada(): string {
    return formatearFecha(this.modelo.fechaNacimiento);
  }

  // --- Envío ----------------------------------------------------------------

  public async onSubmit(formulario: NgForm): Promise<void> {
    if (formulario.invalid) {
      // El equivalente a markAllAsTouched del enfoque reactivo, pero aquí hay
      // que alcanzar el FormGroup que Angular ha construido por detrás.
      formulario.control.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const passwordHash = await hashSha256(this.modelo.password);

      const payload = {
        nombre: this.modelo.nombre,
        email: this.modelo.email,
        fechaNacimiento: this.modelo.fechaNacimiento,
        passwordHash,
      };

      console.log('Payload template-driven (contraseña cifrada SHA-256):', payload);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.mostrarAviso('Formulario enviado correctamente.', 'success');
      formulario.resetForm();
      this.modelo = { nombre: '', email: '', password: '', fechaNacimiento: '' };
    } catch (error) {
      console.error('Error al enviar el formulario', error);
      this.mostrarAviso('No se ha podido enviar el formulario.', 'danger');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private mostrarAviso(mensaje: string, color: 'success' | 'danger'): void {
    this.toastMensaje.set(mensaje);
    this.toastColor.set(color);
    this.toastAbierto.set(true);
  }
}