import { OngPerfilPublico } from "@/types/ong";
import { TimelinePaginado } from "@/types/casos";
import { MascotasPaginado } from "@/types/mascotas";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getPerfilPublicoOng(id: string): Promise<OngPerfilPublico> {
  const res = await fetch(`${API_URL}/organizaciones/${id}/perfil`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cargar el perfil de la organización");
  return res.json();
}

export async function getTimelineOng(id: string, page = 1, limit = 10): Promise<TimelinePaginado> {
  const res = await fetch(`${API_URL}/organizaciones/${id}/timeline?page=${page}&limit=${limit}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cargar el timeline de la organización");
  return res.json();
}

export async function getMascotasOng(
  id: string,
  estado: string | undefined,
  page = 1,
  limit = 12,
): Promise<MascotasPaginado> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (estado) params.set("estado", estado);

  const res = await fetch(`${API_URL}/organizaciones/${id}/mascotas?${params.toString()}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cargar el catálogo de mascotas");
  return res.json();
}
