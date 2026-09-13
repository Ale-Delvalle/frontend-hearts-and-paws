'use client'

import { useState, useEffect, useCallback } from 'react'
import { CasoFeedItem } from '@/types/casos'
import { getFeedGlobal } from '@/services/casesService'
import GlobalFeedPostCard from './GlobalFeedPostCard'

const LIMITE_POR_PAGINA = 10

export type TipoFiltroPublicacion = 'TODOS' | 'ADOPCION' | 'DONACION'

export interface GlobalTimelineProps {
  filtroTipo?: TipoFiltroPublicacion
}

export default function GlobalTimeline({ filtroTipo = 'TODOS' }: GlobalTimelineProps = {}) {
  const [casos, setCasos] = useState<CasoFeedItem[]>([])
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState('')

  const cargarPagina = useCallback(async (paginaActual: number, reemplazar: boolean) => {
    const data = await getFeedGlobal(paginaActual, LIMITE_POR_PAGINA)
    setCasos((prev) => (reemplazar ? data.data : [...prev, ...data.data]))
    setTotal(data.total)
  }, [])

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError('')
    setPagina(1)

    cargarPagina(1, true).catch(() => {
      if (!cancelado) setError('No se pudo cargar el feed de publicaciones.')
    }).finally(() => {
      if (!cancelado) setCargando(false)
    })

    return () => {
      cancelado = true
    }
  }, [cargarPagina])

  const handleCargarMas = async () => {
    setCargandoMas(true)
    try {
      const siguiente = pagina + 1
      await cargarPagina(siguiente, false)
      setPagina(siguiente)
    } catch {
      setError('No se pudieron cargar más publicaciones.')
    } finally {
      setCargandoMas(false)
    }
  }

  const hayMas = casos.length < total

  const casosFiltrados = casos.filter((caso) => {
    if (filtroTipo === 'ADOPCION') return caso.tipo === 'ADOPCION'
    if (filtroTipo === 'DONACION') return caso.tipo !== 'ADOPCION'
    return true
  })

  const mensajeVacio = () => {
    if (filtroTipo === 'ADOPCION') return 'No hay publicaciones de adopción en este momento.'
    if (filtroTipo === 'DONACION') return 'No hay campañas de donación activas en este momento.'
    return 'Todavía no hay publicaciones de ninguna organización.'
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full font-body-editorial">
      {cargando && (
        <div className="flex flex-col gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 overflow-hidden shadow-sm"
            >
              {/* Header skeleton */}
              <div className="flex items-center gap-3 p-4 border-b border-[#6c2f00]/10 dark:border-[#c85a32]/15">
                <div className="w-11 h-11 rounded-full bg-[#ffeade] dark:bg-[#26262e] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-[#ffeade] dark:bg-[#26262e] rounded" />
                  <div className="h-3 w-24 bg-[#ffeade] dark:bg-[#26262e] rounded" />
                </div>
                <div className="h-6 w-20 bg-[#ffeade] dark:bg-[#26262e] rounded-full" />
              </div>
              {/* Image skeleton */}
              <div className="w-full h-72 bg-[#fff1ea] dark:bg-[#26262e]" />
              {/* Content skeleton */}
              <div className="p-6 space-y-3">
                <div className="h-6 w-3/4 bg-[#ffeade] dark:bg-[#26262e] rounded-lg" />
                <div className="h-4 w-full bg-[#ffeade] dark:bg-[#26262e] rounded" />
                <div className="h-4 w-5/6 bg-[#ffeade] dark:bg-[#26262e] rounded" />
                <div className="h-4 w-28 bg-[#ffeade] dark:bg-[#26262e] rounded pt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-red-600 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {!cargando && !error && casosFiltrados.length === 0 && (
        <div className="text-center py-16 px-6 rounded-2xl bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/10 dark:border-[#c85a32]/20 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-[#a84320] dark:text-[#c85a32] mb-3 opacity-80 block">
            feed
          </span>
          <p className="text-base text-[#54433a] dark:text-[#dac2b6] font-medium">
            {mensajeVacio()}
          </p>
        </div>
      )}

      {!cargando && casosFiltrados.length > 0 && (
        <div className="flex flex-col gap-6">
          {casosFiltrados.map((caso) => (
            <GlobalFeedPostCard key={caso.id} caso={caso} />
          ))}
        </div>
      )}

      {hayMas && (
        <button
          onClick={handleCargarMas}
          disabled={cargandoMas}
          className="self-center mt-2 bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-sm hover:scale-105 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {cargandoMas ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
              <span>Cargando publicaciones...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">expand_more</span>
              <span>Cargar más publicaciones</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
