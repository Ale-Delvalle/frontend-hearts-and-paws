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
    <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
      <h2 className="text-xl font-bold text-[#FA8072]">Publicaciones de las ONGs</h2>

      {cargando && (
        <div className="flex flex-col gap-5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 bg-white dark:bg-zinc-900 rounded-2xl border border-[#ffcfc7] dark:border-zinc-700"
            />
          ))}
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && !error && casos.length === 0 && (
        <p className="text-center text-gray-500">
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
          className="self-center bg-white hover:bg-[#ffece8] text-[#FA8072] border border-[#FA8072] py-2 px-6 rounded-full transition disabled:opacity-50"
        >
          {cargandoMas ? 'Cargando...' : 'Cargar más'}
        </button>
      )}
    </div>
  )
}
