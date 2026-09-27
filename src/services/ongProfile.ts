import { OngPerfilPublico, ReconocimientoEstado, ReconocimientoRecibido } from "@/types/ong";
import { TimelinePaginado, CasosCerradosPaginado } from "@/types/casos";
import { MascotasPaginado } from "@/types/mascotas";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getPerfilPublicoOng(id: string): Promise<OngPerfilPublico> {
  const res = await fetch(`${API_URL}/organizaciones/${id}/perfil`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cargar el perfil de la organización");
  return res.json();
}

export async function getMiEstadoReconocimiento(id: string): Promise<ReconocimientoEstado> {
  const res = await fetch(`${API_URL}/organizaciones/${id}/reconocimientos/mi-estado`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo consultar el estado del reconocimiento");
  return res.json();
}

export async function otorgarReconocimiento(
  id: string,
  mensaje?: string,
): Promise<{ ok: boolean; mensaje: string }> {
  const res = await fetch(`${API_URL}/organizaciones/${id}/reconocimientos`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensaje }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "No se pudo otorgar el reconocimiento");
  return data;
}

export async function revocarReconocimiento(
  id: string,
  motivo?: string,
): Promise<{ ok: boolean; mensaje: string }> {
  const res = await fetch(`${API_URL}/organizaciones/${id}/reconocimientos`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ motivo }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "No se pudo revocar el reconocimiento");
  return data;
}

export async function getMisReconocimientos(): Promise<ReconocimientoRecibido[]> {
  const res = await fetch(`${API_URL}/organizaciones/mis-reconocimientos`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudieron cargar los reconocimientos recibidos");
  return res.json();
}

export async function getTimelineOng(id: string, page = 1, limit = 10): Promise<TimelinePaginado> {
  const res = await fetch(`${API_URL}/organizaciones/${id}/timeline?page=${page}&limit=${limit}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cargar el timeline de la organización");
  return res.json();
}

export async function getCasosCerradosOng(
  id: string,
  page = 1,
  limit = 10,
  motivo?: string,
): Promise<CasosCerradosPaginado> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (motivo) params.set("motivo", motivo);

  const res = await fetch(`${API_URL}/organizaciones/${id}/casos-cerrados?${params.toString()}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudieron cargar los casos cerrados de la organización");
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
