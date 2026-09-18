import {
  MascotasPerdidasPaginadas,
  MascotaPerdida,
  FiltrosMascotasPerdidas,
  EstadoPerdida,
} from '@/types/mascotaPerdida';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMascotasPerdidas(
  filtros: FiltrosMascotasPerdidas = {}
): Promise<MascotasPerdidasPaginadas> {
  const queryParams = new URLSearchParams();

  if (filtros.estado) queryParams.set('estado', filtros.estado);
  if (filtros.tipo) queryParams.set('tipo', filtros.tipo);
  if (filtros.ciudad) queryParams.set('ciudad', filtros.ciudad);
  if (filtros.search) queryParams.set('search', filtros.search);
  if (filtros.page) queryParams.set('page', filtros.page.toString());
  if (filtros.limit) queryParams.set('limit', filtros.limit.toString());

  const url = `${API_URL}/mascotas-perdidas?${queryParams.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Error al cargar publicaciones de mascotas perdidas.');
  }

  return await res.json();
}

export async function getMascotaPerdidaById(id: string): Promise<MascotaPerdida> {
  const res = await fetch(`${API_URL}/mascotas-perdidas/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('No se encontró la publicación de la mascota perdida.');
  }

  return await res.json();
}

export async function crearMascotaPerdida(formData: FormData): Promise<{
  ok: boolean;
  mensaje: string;
  publicacion: MascotaPerdida;
}> {
  const res = await fetch(`${API_URL}/mascotas-perdidas`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || 'Error al publicar mascota perdida.');
  }

  return data;
}

export async function actualizarEstadoMascotaPerdida(
  id: string,
  estado: EstadoPerdida
): Promise<{ ok: boolean; mensaje: string; publicacion: MascotaPerdida }> {
  const res = await fetch(`${API_URL}/mascotas-perdidas/${id}/estado`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || 'Error al actualizar el estado de la publicación.');
  }

  return data;
}

export async function eliminarMascotaPerdida(
  id: string
): Promise<{ ok: boolean; mensaje: string }> {
  const res = await fetch(`${API_URL}/mascotas-perdidas/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || 'Error al eliminar la publicación.');
  }

  return data;
}
