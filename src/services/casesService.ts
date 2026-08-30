
import { Caso, FeedGlobalPaginado } from "@/types/casos";

const API_URL = process.env.NEXT_PUBLIC_API_URL!; // El ! es para decir que nunca será undefined

export async function getCasesByOng(): Promise<Caso[]> {
  const res = await fetch(`${API_URL}/casos/ong/mis-casos`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al cargar casos");
  return res.json();
}

export async function getFeedGlobal(page = 1, limit = 10): Promise<FeedGlobalPaginado> {
  const res = await fetch(`${API_URL}/casos/timeline?page=${page}&limit=${limit}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cargar el feed de publicaciones");
  return res.json();
}

export async function getCasoPorId(id: string): Promise<Caso> {
  const res = await fetch(`${API_URL}/casos/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener el caso");
  return res.json();
}
