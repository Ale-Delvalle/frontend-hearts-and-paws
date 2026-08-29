export const ESTADOS_MASCOTA = {
  EN_ADOPCION: { label: 'En adopción', className: 'bg-emerald-50 text-emerald-600' },
  EN_TRANSITO: { label: 'En tránsito', className: 'bg-amber-50 text-amber-600' },
  ADOPTADO: { label: 'Adoptado', className: 'bg-sky-50 text-sky-600' },
  FALLECIDO: { label: 'Dado de baja', className: 'bg-gray-100 text-gray-500' },
} as const

export type EstadoMascotaKey = keyof typeof ESTADOS_MASCOTA
