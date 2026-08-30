// types/casos.ts
import { Mascota } from './mascotas'

export interface Caso {
  id: string
  titulo: string
  descripcion: string
  tipo: 'ADOPCION' | 'DONACION'
  ongId: string
  mascotaId: string
  creado_en: string
  mascota: Mascota
}

// GET /organizaciones/:id/timeline
export interface CasoTimelineItem {
  id: string
  titulo: string
  descripcion: string
  tipo: 'ADOPCION' | 'DONACION'
  mascotaId: string
  ongId: string | null
  creado_en: string
  mascota: {
    id: string
    nombre: string
    imagenes: { id: string; url: string }[]
  }
  adopcion: { id: string; estado: 'PENDIENTE' | 'ACEPTADA' } | null
  donacion: { id: string; estadoDonacion: number; metaDonacion: number; estado: 'ACTIVO' | 'COMPLETADO' } | null
}

export interface TimelinePaginado {
  data: CasoTimelineItem[]
  total: number
  page: number
  limit: number
}

// GET /casos/timeline
export interface OngResumen {
  id: string
  nombre: string
  imagenPerfil: string | null
  ciudad: string | null
  pais: string | null
}

export interface CasoFeedItem extends Omit<CasoTimelineItem, 'ongId'> {
  ong: OngResumen
}

export interface FeedGlobalPaginado {
  data: CasoFeedItem[]
  total: number
  page: number
  limit: number
}
