import { InsigniaOtorgada, TipoInsignia, UsuarioBuscado } from '@/types/insignia';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function buscarUsuarios(q: string): Promise<UsuarioBuscado[]> {
  const res = await fetch(`${API_URL}/insignias/usuarios?q=${encodeURIComponent(q)}`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || 'Error al buscar usuarios.');
  }

  return data;
}

export async function getInsigniasOtorgadas(): Promise<InsigniaOtorgada[]> {
  const res = await fetch(`${API_URL}/insignias`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Error al cargar las insignias otorgadas.');
  }

  return res.json();
}

export async function otorgarInsignia(
  usuarioId: string,
  tipo: TipoInsignia
): Promise<{ ok: boolean; mensaje: string }> {
  const res = await fetch(`${API_URL}/insignias`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuarioId, tipo }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || 'Error al otorgar la insignia.');
  }

  return data;
}

export async function revocarInsignia(id: string): Promise<{ ok: boolean; mensaje: string }> {
  const res = await fetch(`${API_URL}/insignias/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || 'Error al revocar la insignia.');
  }

  return data;
}
