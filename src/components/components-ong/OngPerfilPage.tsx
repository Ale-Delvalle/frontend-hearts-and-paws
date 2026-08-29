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
      {cargando && <p className="text-center text-gray-500">Cargando organización...</p>}
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
