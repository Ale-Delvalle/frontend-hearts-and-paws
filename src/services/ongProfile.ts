import { OngPerfilPublico } from "@/types/ong";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getPerfilPublicoOng(id: string): Promise<OngPerfilPublico> {
  const res = await fetch(`${API_URL}/organizaciones/${id}/perfil`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cargar el perfil de la organización");
  return res.json();
}
