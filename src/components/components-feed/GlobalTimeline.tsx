'use client'

import { useState, useEffect, useCallback } from 'react'
import { CasoFeedItem } from '@/types/casos'
import { getFeedGlobal } from '@/services/casesService'
import GlobalFeedPostCard from './GlobalFeedPostCard'

const LIMITE_POR_PAGINA = 10

export default function GlobalTimeline() {
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

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full font-body-editorial">
      {cargando && (
        <div className="flex flex-col gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 bg-[#fff1ea] rounded-2xl border border-[#6c2f00]/15"
            />
          ))}
        </div>
      )}
      {error && <p className="text-center text-[#ae2f34] font-medium">{error}</p>}

      {!cargando && !error && casos.length === 0 && (
        <p className="text-center text-[#54433a]">
          Todavía no hay publicaciones de ninguna organización.
        </p>
      )}

      {casos.map((caso) => (
        <GlobalFeedPostCard key={caso.id} caso={caso} />
      ))}

      {hayMas && (
        <button
          onClick={handleCargarMas}
          disabled={cargandoMas}
          className="self-center bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-sm hover:scale-105 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {cargandoMas ? 'Cargando...' : 'Cargar más publicaciones'}
        </button>
      )}
    </div>
  )
}
