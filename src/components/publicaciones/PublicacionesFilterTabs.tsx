'use client'

import { TipoFiltroPublicacion } from '@/components/components-feed/GlobalTimeline'

interface PublicacionesFilterTabsProps {
  filtroActivo: TipoFiltroPublicacion
  onSelectFiltro: (filtro: TipoFiltroPublicacion) => void
}

const OPCIONES_FILTRO: {
  id: TipoFiltroPublicacion
  label: string
  icon: string
  descripcion: string
}[] = [
  {
    id: 'TODOS',
    label: 'Todas las publicaciones',
    icon: 'feed',
    descripcion: 'Feed completo de la red',
  },
  {
    id: 'ADOPCION',
    label: 'En Adopción',
    icon: 'pets',
    descripcion: 'Animales buscando un hogar',
  },
  {
    id: 'DONACION',
    label: 'Donaciones y Ayuda',
    icon: 'volunteer_activism',
    descripcion: 'Casos médicos y aportes urgentes',
  },
]

export default function PublicacionesFilterTabs({
  filtroActivo,
  onSelectFiltro,
}: PublicacionesFilterTabsProps) {
  return (
    <div className="bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-5 shadow-sm font-body-editorial">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif font-bold text-sm text-[#6c2f00] dark:text-[#ffdbc9] uppercase tracking-wider">
          Filtrar Contenido
        </h4>
        <span className="material-symbols-outlined text-[#c85a32] text-base">filter_alt</span>
      </div>

      <div className="flex flex-col gap-2">
        {OPCIONES_FILTRO.map((opcion) => {
          const estaActivo = filtroActivo === opcion.id
          return (
            <button
              key={opcion.id}
              onClick={() => onSelectFiltro(opcion.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                estaActivo
                  ? 'bg-[#c85a32] text-white shadow-xs'
                  : 'bg-[#fff8f5]/60 dark:bg-[#26262e]/50 text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] border border-[#6c2f00]/10 dark:border-[#c85a32]/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`material-symbols-outlined text-lg ${
                    estaActivo ? 'text-white' : 'text-[#c85a32]'
                  }`}
                >
                  {opcion.icon}
                </span>
                <div>
                  <div className="font-semibold leading-tight">{opcion.label}</div>
                  <div
                    className={`text-[10px] font-normal leading-tight ${
                      estaActivo ? 'text-white/80' : 'text-[#54433a]/70 dark:text-[#dac2b6]/70'
                    }`}
                  >
                    {opcion.descripcion}
                  </div>
                </div>
              </div>
              {estaActivo && (
                <span className="material-symbols-outlined text-base text-white">
                  check_circle
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
