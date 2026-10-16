import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline, downloadOutline } from 'ionicons/icons';
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
} from '@ionic/angular';
import { ThemeService } from '../core/theme.service';
import { PdfService, DatosRegistro } from '../core/pdf.service';
import { fechaNoFuturaValidator } from '../core/validadores';
import { hashSha256 } from '../core/password.util';
import { formatearFecha } from '../core/fecha.util';

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
    IonButton,
    IonButtons,
    IonIcon,
    IonSpinner,
    IonToast,
    IonNote,
    IonDatetime,
    IonModal,
  ],
})
export class RegistroPage {
  private fb = inject(FormBuilder);
  private tema = inject(ThemeService);
  private pdf = inject(PdfService);

  /** Formulario reactivo de registro de usuario. */
  public registroForm: FormGroup;

  /** Estado de envío: desactiva el formulario y muestra el loader. */
  public isSubmitting = signal<boolean>(false);

  /** Control del aviso emergente de confirmación o error. */
  public toastAbierto = signal<boolean>(false);
  public toastMensaje = signal<string>('');
  public toastColor = signal<'success' | 'danger'>('success');

  /** Gobierna la apertura del calendario. */
  public calendarioAbierto = signal<boolean>(false);

  /** Datos del último envío correcto, origen del PDF. */
  public ultimosDatos = signal<DatosRegistro | null>(null);

  /** Fecha máxima seleccionable: hoy, en formato ISO. */
  public fechaMaxima = new Date().toISOString().split('T')[0];

  /** Valor de la fecha antes de abrir el calendario, para poder cancelar. */
  private valorFechaPrevio: string | null = null;

  constructor() {
    addIcons({ moonOutline, sunnyOutline, downloadOutline });

    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          // Mínimo 8 caracteres, al menos una letra y un número.
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        ],
      ],
      fechaNacimiento: ['', [Validators.required, fechaNoFuturaValidator]],
    });
  }

  /** Acceso cómodo a los controles desde la plantilla. */
  get f() {
    return this.registroForm.controls;
  }

  /** Cierto cuando la aplicación está en modo oscuro. */
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
    this.valorFechaPrevio = this.f['fechaNacimiento'].value ?? null;
    this.calendarioAbierto.set(true);
  }

  /** Conserva la fecha elegida y cierra el calendario. */
  aceptarFecha(): void {
    this.f['fechaNacimiento'].markAsTouched();
    this.calendarioAbierto.set(false);
  }

  /**
   * Devuelve el valor anterior y cierra el calendario.
   * Al enlazar el ion-datetime con formControlName, el control ya se ha
   * actualizado al pulsar un día, así que cancelar implica restaurar.
   */
  cancelarFecha(): void {
    this.f['fechaNacimiento'].setValue(this.valorFechaPrevio);
    this.f['fechaNacimiento'].markAsTouched();
    this.calendarioAbierto.set(false);
  }

  /** Fecha del control en formato dd/mm/aaaa para mostrarla en el campo. */
  fechaFormateada(): string {
    return formatearFecha(this.f['fechaNacimiento'].value);
  }

  // --- Envío ----------------------------------------------------------------

  public async onSubmit(): Promise<void> {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const { nombre, email, password, fechaNacimiento } = this.registroForm.value;

      // La contraseña se cifra antes de construir el payload, de modo que
      // nunca llega a consola ni al PDF en texto plano.
      const passwordHash = await hashSha256(password);

      const payload: DatosRegistro = {
        nombre,
        email,
        fechaNacimiento,
        passwordHash,
      };

      console.log('Payload a enviar a la API REST (contraseña cifrada SHA-256):', payload);

      // Simulación de la llamada asíncrona al backend.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.ultimosDatos.set(payload);
      this.mostrarAviso('Formulario enviado correctamente.', 'success');
      this.registroForm.reset();
    } catch (error) {
      console.error('Error al enviar el formulario', error);
      this.mostrarAviso('No se ha podido enviar el formulario.', 'danger');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // --- PDF ------------------------------------------------------------------

  descargarPdf(): void {
    const datos = this.ultimosDatos();
    if (!datos) {
      return;
    }
    try {
      this.pdf.generar(datos);
    } catch (error) {
      console.error('Error al generar el PDF', error);
      this.mostrarAviso('No se ha podido generar el PDF.', 'danger');
    }
  }

  // --- Avisos ---------------------------------------------------------------

  private mostrarAviso(mensaje: string, color: 'success' | 'danger'): void {
    this.toastMensaje.set(mensaje);
    this.toastColor.set(color);
    this.toastAbierto.set(true);
  }
}