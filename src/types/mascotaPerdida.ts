export type EstadoPerdida = 'PERDIDO' | 'ENCONTRADO' | 'REUNIDO';

export interface AutorPublicacion {
  id: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  imagenPerfil?: string | null;
}

export interface MascotaPerdida {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  ubicacion: string;
  ciudad?: string | null;
  contacto: string;
  imagenUrl?: string | null;
  recompensa?: string | null;
  estado: EstadoPerdida;
  fechaPerdido: string;
  creado_en: string;
  usuarioId?: string | null;
  usuario?: AutorPublicacion | null;
  organizacionId?: string | null;
  organizacion?: AutorPublicacion | null;
}

export interface MascotasPerdidasPaginadas {
  data: MascotaPerdida[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface FiltrosMascotasPerdidas {
  estado?: string;
  tipo?: string;
  ciudad?: string;
  search?: string;
  page?: number;
  limit?: number;
}
