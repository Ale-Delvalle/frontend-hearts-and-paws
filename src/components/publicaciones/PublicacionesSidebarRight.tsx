'use client'

import MascotasUrgentesWidget from './MascotasUrgentesWidget'
import ConsejosComunidadWidget from './ConsejosComunidadWidget'

export default function PublicacionesSidebarRight() {
  return (
    <aside className="w-full space-y-5">
      {/* Widget de adopciones urgentes */}
      <MascotasUrgentesWidget />

      {/* Widget de consejos de la red y garantías */}
      <ConsejosComunidadWidget />
    </aside>
  )
}
