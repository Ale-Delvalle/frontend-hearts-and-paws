'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { useOngAuth } from '@/context/OngAuthContext'
import { useAuth } from '@/components/SupabaseProvider'
import GlobalTimeline, { TipoFiltroPublicacion } from '@/components/components-feed/GlobalTimeline'
import PublicacionesSidebarLeft from './PublicacionesSidebarLeft'
import PublicacionesSidebarRight from './PublicacionesSidebarRight'

export default function PublicacionesPage() {
  const router = useRouter()
  const { usuario, loading: loadingUsuario } = useUsuarioAuth()
  const { ong, loading: loadingOng } = useOngAuth()
  const { user } = useAuth()

  const [filtroTipo, setFiltroTipo] = useState<TipoFiltroPublicacion>('TODOS')

  const estaCargando = loadingUsuario || loadingOng
  const estaAutenticado = Boolean(usuario || ong || user)

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.replace('/login')
    }
  }, [estaCargando, estaAutenticado, router])

  if (estaCargando) {
    return (
      <div className="py-12 md:py-16 px-6 md:px-12 max-w-[1360px] mx-auto w-full">
        <div className="h-10 w-64 bg-[#fff1ea] dark:bg-[#26262e] rounded-xl mx-auto mb-8 animate-pulse" />
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="w-full lg:w-72 h-96 bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 animate-pulse shrink-0" />
          <div className="flex-1 max-w-2xl w-full space-y-6">
            <div className="h-80 bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 animate-pulse" />
            <div className="h-80 bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 animate-pulse" />
          </div>
          <div className="w-full xl:w-80 h-96 bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 animate-pulse shrink-0 hidden xl:block" />
        </div>
      </div>
    )
  }

  if (!estaAutenticado) {
    return null
  }

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 md:px-10 max-w-[1360px] mx-auto font-body-editorial">
      {/* Header editorial */}
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#c85a32]/10 dark:bg-[#c85a32]/20 text-[#c85a32] mb-3 border border-[#c85a32]/20">
          <span className="material-symbols-outlined text-2xl">pets</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] tracking-tight">
          Publicaciones de la Red
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#54433a] dark:text-[#dac2b6] leading-relaxed max-w-xl mx-auto">
          Casos activos, avisos y novedades compartidas en tiempo real por nuestras organizaciones aliadas.
        </p>
      </div>

      {/* Layout de 3 Columnas */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Lateral Izquierdo: Identidad y Filtros (Sticky en escritorio) */}
        <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
          <PublicacionesSidebarLeft
            filtroActivo={filtroTipo}
            onSelectFiltro={setFiltroTipo}
          />
        </div>

        {/* Columna Central: Feed Principal */}
        <main className="flex-1 min-w-0 max-w-2xl w-full">
          <GlobalTimeline filtroTipo={filtroTipo} />
        </main>

        {/* Lateral Derecho: Adopciones Urgentes y Consejos (Sticky en xl:) */}
        <div className="w-full xl:w-80 shrink-0 xl:sticky xl:top-24 hidden xl:block">
          <PublicacionesSidebarRight />
        </div>
      </div>
    </div>
  )
}
