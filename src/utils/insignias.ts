import { GeneroUsuario, TipoInsignia } from '@/types/insignia';

/**
 * Devuelve el nombre visible de una insignia según su tipo y el género del usuario.
 * Sin género definido, "Padrino" se muestra en su forma neutra "Padrino/Madrina".
 */
export function etiquetaInsignia(tipo: TipoInsignia, genero?: GeneroUsuario | null): string {
  if (tipo === 'TRANSITO') {
    return 'Tránsito';
  }

  if (genero === 'FEMENINO') return 'Madrina';
  if (genero === 'MASCULINO') return 'Padrino';
  return 'Padrino/Madrina';
}

/**
 * Texto completo de la insignia, ej. "Madrina de Patitas Felices" o "Tránsito en Colonia Michis".
 */
export function textoInsignia(
  tipo: TipoInsignia,
  nombreOrganizacion: string,
  genero?: GeneroUsuario | null
): string {
  const etiqueta = etiquetaInsignia(tipo, genero);
  const nexo = tipo === 'TRANSITO' ? 'en' : 'de';
  return `${etiqueta} ${nexo} ${nombreOrganizacion}`;
}
