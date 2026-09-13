'use client'

import PublicacionesUserCard from './PublicacionesUserCard'
import PublicacionesFilterTabs from './PublicacionesFilterTabs'
import { TipoFiltroPublicacion } from '@/components/components-feed/GlobalTimeline'

interface PublicacionesSidebarLeftProps {
  filtroActivo: TipoFiltroPublicacion
  onSelectFiltro: (filtro: TipoFiltroPublicacion) => void
}

export default function PublicacionesSidebarLeft({
  filtroActivo,
  onSelectFiltro,
}: PublicacionesSidebarLeftProps) {
  return (
    <aside className="w-full space-y-5">
      {/* Tarjeta de usuario u ONG */}
      <PublicacionesUserCard />

      {/* Selector de filtros de publicaciones */}
      <PublicacionesFilterTabs
        filtroActivo={filtroActivo}
        onSelectFiltro={onSelectFiltro}
      />

      {/* Mini Tarjeta de Impacto Comunitario */}
      <div className="bg-[#fff1ea]/60 dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/10 dark:border-[#c85a32]/20 p-5 font-body-editorial">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a84320] dark:text-[#c85a32] mb-2">
          <span className="material-symbols-outlined text-base">diversity_1</span>
          Red Hearts & Paws
        </div>
        <p className="text-xs text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
          Cada interacción, adopción y donación impulsa la labor de refugios y rescatistas independientes en todo el país.
        </p>
      </div>
    </aside>
  )
}
