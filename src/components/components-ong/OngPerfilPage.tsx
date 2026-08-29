'use client'

import { useState, useEffect } from 'react'
import { OngPerfilPublico } from '@/types/ong'
import { getPerfilPublicoOng } from '@/services/ongProfile'
import OngPerfilHeader from './OngPerfilHeader'

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
    <div className="flex flex-col items-center justify-start py-10 px-4 bg-[#fff5f2] dark:bg-black min-h-screen">
      <div className="w-full max-w-4xl">
        {cargando && <p className="text-center text-gray-500">Cargando organización...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!cargando && ong && <OngPerfilHeader ong={ong} />}
      </div>
    </div>
  )
}
