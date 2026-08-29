'use client'

import { useState, useEffect, useCallback } from 'react'
import { MascotaCatalogoItem } from '@/types/mascotas'
import { getMascotasOng } from '@/services/ongProfile'
import MascotaCatalogoCard from './MascotaCatalogoCard'
import { ESTADOS_MASCOTA, EstadoMascotaKey } from '@/lib/estadoMascota'

const LIMITE_POR_PAGINA = 12

export default function OngMascotasCatalogo({ ongId }: { ongId: string }) {
  const [mascotas, setMascotas] = useState<MascotaCatalogoItem[]>([])
  const [estado, setEstado] = useState<EstadoMascotaKey | ''>('')
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState('')

  const cargarPagina = useCallback(
    async (paginaActual: number, reemplazar: boolean) => {
      const data = await getMascotasOng(ongId, estado || undefined, paginaActual, LIMITE_POR_PAGINA)
      setMascotas((prev) => (reemplazar ? data.data : [...prev, ...data.data]))
      setTotal(data.total)
    },
    [ongId, estado],
  )

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError('')
    setPagina(1)

    cargarPagina(1, true)
      .catch(() => {
        if (!cancelado) setError('No se pudo cargar el catálogo de mascotas.')
      })
      .finally(() => {
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
      setError('No se pudieron cargar más mascotas.')
    } finally {
      setCargandoMas(false)
    }
  }

  const hayMas = mascotas.length < total

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-[#FA8072]">Mascotas</h2>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoMascotaKey | '')}
          className="appearance-none text-sm px-4 py-2 pr-8 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FA8072]"
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADOS_MASCOTA).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p className="text-center text-gray-500">Cargando mascotas...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && !error && mascotas.length === 0 && (
        <p className="text-center text-gray-500">No hay mascotas para mostrar.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {mascotas.map((mascota) => (
          <MascotaCatalogoCard key={mascota.id} mascota={mascota} />
        ))}
      </div>

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
