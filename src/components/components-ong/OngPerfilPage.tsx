'use client'

import { useState, useEffect } from 'react'
import { OngPerfilPublico } from '@/types/ong'
import { getPerfilPublicoOng } from '@/services/ongProfile'
import OngPerfilHeader from './OngPerfilHeader'
import OngPerfilTabs from './OngPerfilTabs'

export default function OngPerfilPage({ id }: { id: string }) {
  const [ong, setOng] = useState<OngPerfilPublico | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarPerfil() {
      setCargando(true)
      setError('')
      try {
        const data = await getPerfilPublicoOng(id)
        setOng(data)
      } catch {
        setError('No se encontró la organización que buscás.')
        setOng(null)
      } finally {
        setCargando(false)
      }
    }
    cargarPerfil()
  }, [id])

  return (
    <div className="bg-[#fff5f2] dark:bg-black min-h-screen py-10 px-4">
      {cargando && (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start animate-pulse">
          <div className="flex flex-col items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-[#ffcfc7] dark:border-zinc-700 p-6">
            <div className="w-28 h-28 rounded-full bg-[#ffece8] dark:bg-zinc-800" />
            <div className="h-5 w-32 bg-[#ffece8] dark:bg-zinc-800 rounded" />
            <div className="h-3 w-20 bg-[#ffece8] dark:bg-zinc-800 rounded" />
            <div className="h-3 w-full bg-[#ffece8] dark:bg-zinc-800 rounded" />
            <div className="h-3 w-3/4 bg-[#ffece8] dark:bg-zinc-800 rounded" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-10 w-64 bg-[#ffece8] dark:bg-zinc-800 rounded-full" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-white dark:bg-zinc-900 rounded-2xl border border-[#ffcfc7] dark:border-zinc-700"
              />
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && ong && (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          <aside className="lg:sticky lg:top-8">
            <OngPerfilHeader ong={ong} />
          </aside>
          <main>
            <OngPerfilTabs ongId={ong.id} />
          </main>
        </div>
      )}
    </div>
  )
}
