'use client'

import { useState, useEffect } from 'react'
import { MascotaPerfil } from '@/types/mascotas'
import { getPerfilMascota } from '@/services/mascotaProfile'

export default function MascotaPerfilPage({ id }: { id: string }) {
  const [mascota, setMascota] = useState<MascotaPerfil | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarPerfil() {
      setCargando(true)
      setError('')
      try {
        const data = await getPerfilMascota(id)
        setMascota(data)
      } catch {
        setError('No se encontró la mascota que buscás.')
        setMascota(null)
      } finally {
        setCargando(false)
      }
    }
    cargarPerfil()
  }, [id])

  return (
    <div className="bg-[#fff5f2] dark:bg-black min-h-screen py-10 px-4">
      {cargando && <p className="text-center text-gray-500">Cargando mascota...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && mascota && (
        <h1 className="text-3xl font-extrabold text-center text-[#FA8072]">
          {mascota.nombre}
        </h1>
      )}
    </div>
  )
}
