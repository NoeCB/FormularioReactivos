/**
 * Calcula el resumen SHA-256 de un texto y lo devuelve en hexadecimal.
 *
 * Se usa la Web Crypto API del navegador, por lo que no hace falta ninguna
 * dependencia externa. Requiere contexto seguro (HTTPS o localhost).
 *
 * AVISO IMPORTANTE: cifrar la contraseña en el cliente NO es una medida de
 * seguridad real. Quien intercepte este resumen puede reutilizarlo igual que
 * la contraseña original. La protección auténtica consiste en transmitir por
 * HTTPS y volver a hashear en el servidor con bcrypt o argon2, que además
 * incorporan salt. Aquí se aplica para cumplir el requisito de no exponer la
 * contraseña en texto plano por consola.
 */
export async function hashSha256(texto: string): Promise<string> {
  const datos = new TextEncoder().encode(texto);
  const resumen = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(resumen))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}