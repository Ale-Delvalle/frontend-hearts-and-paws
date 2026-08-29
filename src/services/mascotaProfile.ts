import { MascotaPerfil } from "@/types/mascotas";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getPerfilMascota(id: string): Promise<MascotaPerfil> {
  const res = await fetch(`${API_URL}/mascotas/${id}/perfil`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cargar el perfil de la mascota");
  return res.json();
}
