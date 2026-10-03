/**
 * Pide a Cloudinary una versión ya redimensionada y optimizada de una imagen,
 * sin necesidad de volver a subirla: Cloudinary genera y cachea la variante
 * la primera vez que se solicita esa URL.
 *
 * Si la URL no es de Cloudinary (ej. ui-avatars.com, /default-avatar.png,
 * una foto de perfil de Supabase, o un blob: local de una preview), se
 * devuelve sin modificar.
 *
 * @param url URL original de la imagen.
 * @param tamanio Tamaño (en px) en el que se va a mostrar la imagen en pantalla.
 * @param multiplicador Cuántas veces el tamaño visual pedir, para que se vea
 *   nítida en pantallas de alta densidad (Retina). Default 3x.
 */
export function optimizarAvatar(url: string, tamanio: number, multiplicador?: number): string;
export function optimizarAvatar(
  url: string | null | undefined,
  tamanio: number,
  multiplicador?: number
): string | null | undefined;
export function optimizarAvatar(
  url: string | null | undefined,
  tamanio: number,
  multiplicador = 3
): string | null | undefined {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  const ancho = Math.round(tamanio * multiplicador);
  const transformacion = `c_fill,g_face,w_${ancho},h_${ancho},q_auto,f_auto,dpr_auto`;

  return url.replace('/upload/', `/upload/${transformacion}/`);
}
