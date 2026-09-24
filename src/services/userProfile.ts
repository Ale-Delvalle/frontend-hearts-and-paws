import { UsuarioPerfilPublico } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getPerfilPublicoUsuario(id: string): Promise<UsuarioPerfilPublico> {
  const res = await fetch(`${API_URL}/usuarios/${id}/perfil`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('No se pudo cargar el perfil del usuario');
  return res.json();
}
