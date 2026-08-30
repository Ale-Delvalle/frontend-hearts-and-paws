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
  estado?: 'EN_ADOPCION' | 'EN_TRANSITO' | 'ADOPTADO' | 'FALLECIDO'
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

// GET /mascotas/:id/perfil
export interface MascotaCasoHistorial {
  id: string
  titulo: string
  descripcion: string
  tipo: 'ADOPCION' | 'DONACION'
  mascotaId: string
  ongId: string | null
  creado_en: string
  adopcion: { id: string; estado: 'PENDIENTE' | 'ACEPTADA' } | null
  donacion: { id: string; estadoDonacion: number; metaDonacion: number; estado: 'ACTIVO' | 'COMPLETADO' } | null
}

export interface MascotaPerfil {
  id: string
  nombre: string
  edad: number
  descripcion: string | null
  estado: 'EN_ADOPCION' | 'EN_TRANSITO' | 'ADOPTADO' | 'FALLECIDO'
  creada_en: string
  organizacionId: string
  tipoId: string
  tipo: { id: string; nombre: string }
  imagenes: { id: string; url: string; urlBlur: string | null; esSensible: boolean | null }[]
  organizacion: {
    id: string
    nombre: string
    imagenPerfil: string | null
    ciudad: string | null
    pais: string | null
  }
  casos: MascotaCasoHistorial[]
}