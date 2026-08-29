'use client'

import { useState, useEffect, useCallback } from 'react'
import { CasoTimelineItem } from '@/types/casos'
import { getTimelineOng } from '@/services/ongProfile'
import TimelinePostCard from './TimelinePostCard'

const LIMITE_POR_PAGINA = 10

export default function OngTimeline({ ongId }: { ongId: string }) {
  const [casos, setCasos] = useState<CasoTimelineItem[]>([])
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState('')

  const cargarPagina = useCallback(
    async (paginaActual: number, reemplazar: boolean) => {
      const data = await getTimelineOng(ongId, paginaActual, LIMITE_POR_PAGINA)
      setCasos((prev) => (reemplazar ? data.data : [...prev, ...data.data]))
      setTotal(data.total)
    },
    [ongId],
  )

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError('')
    setPagina(1)

    cargarPagina(1, true).catch(() => {
      if (!cancelado) setError('No se pudo cargar el timeline de esta organización.')
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
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-[#FA8072]">Publicaciones</h2>

      {cargando && <p className="text-center text-gray-500">Cargando publicaciones...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && !error && casos.length === 0 && (
        <p className="text-center text-gray-500">
          Esta organización todavía no publicó ningún caso.
        </p>
      )}

      {casos.map((caso) => (
        <TimelinePostCard key={caso.id} caso={caso} />
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
