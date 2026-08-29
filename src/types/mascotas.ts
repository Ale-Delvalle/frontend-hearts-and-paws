//types/mascota.ts
export interface Imagen {
  id: string
  url: string
}

export interface Mascota {
  id: string
  nombre: string
  tipo: string
  imagenes: Imagen[]
  descripcion: string
  casoId:string
}

export interface MascotaCardProps {
  mascota: Mascota
  onConocerHistoria?: (mascota: Mascota) => void
  onAdoptar?: (id: string) => void
}

// Esta es la que usa MascotaCard
export interface MascotaCardConModoProps extends MascotaCardProps {
  modo: 'adopcion' | 'donacion'
}

// Esta es para MascotaModal
export interface MascotaModalProps {
  mascota: Mascota
  visible: boolean
  cargando?: boolean
  onClose: () => void
  onAccion?: (id: string) => void
  modo: 'adopcion' | 'donacion'
}

// GET /organizaciones/:id/mascotas
export interface MascotaCatalogoItem {
  id: string
  nombre: string
  edad: number
  descripcion: string | null
  estado: 'EN_ADOPCION' | 'EN_TRANSITO' | 'ADOPTADO' | 'FALLECIDO'
  creada_en: string
  organizacionId: string
  tipoId: string
  tipo: { id: string; nombre: string }
  imagenes: { id: string; url: string }[]
}

export interface MascotasPaginado {
  data: MascotaCatalogoItem[]
  total: number
  page: number
  limit: number
}