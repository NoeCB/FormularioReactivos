import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { formatearFecha } from './fecha.util';

/** Datos de un registro ya enviado, listos para volcarse a PDF. */
export interface DatosRegistro {
  nombre: string;
  email: string;
  fechaNacimiento: string;
  passwordHash: string;
}

@Injectable({ providedIn: 'root' })
export class PdfService {
  /**
   * Genera un PDF de una página con los datos del registro y lo entrega al
   * navegador como descarga. Todo ocurre en el cliente: los datos no viajan
   * a ningún servicio externo.
   */
  generar(datos: DatosRegistro): void {
    const doc = new jsPDF();
    const margenIzquierdo = 20;
    let y = 25;

    doc.setFontSize(18);
    doc.text('Justificante de registro', margenIzquierdo, y);

    y += 10;
    doc.setFontSize(10);
    doc.text('Generado el ' + formatearFecha(new Date().toISOString()), margenIzquierdo, y);

    y += 12;
    doc.setDrawColor(167, 139, 250);
    doc.line(margenIzquierdo, y, 190, y);

    const filas: [string, string][] = [
      ['Nombre completo', datos.nombre],
      ['Correo electronico', datos.email],
      ['Fecha de nacimiento', formatearFecha(datos.fechaNacimiento)],
    ];

    y += 12;
    doc.setFontSize(12);
    for (const [etiqueta, valor] of filas) {
      doc.setFont('helvetica', 'bold');
      doc.text(etiqueta + ':', margenIzquierdo, y);
      doc.setFont('helvetica', 'normal');
      doc.text(valor, margenIzquierdo + 55, y);
      y += 10;
    }

    // La contraseña no se incluye nunca en claro, solo su resumen.
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Contrasena (resumen SHA-256):', margenIzquierdo, y);
    y += 6;
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    for (const trozo of doc.splitTextToSize(datos.passwordHash, 165) as string[]) {
      doc.text(trozo, margenIzquierdo, y);
      y += 5;
    }

    doc.save('justificante-registro.pdf');
  }
}