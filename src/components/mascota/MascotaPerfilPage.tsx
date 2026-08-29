'use client'

import { useState, useEffect } from 'react'
import { MascotaPerfil } from '@/types/mascotas'
import { getPerfilMascota } from '@/services/mascotaProfile'
import MascotaGaleria from './MascotaGaleria'
import MascotaInfo from './MascotaInfo'
import MascotaCasoHistorialCard from './MascotaCasoHistorialCard'

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
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
            <MascotaGaleria imagenes={mascota.imagenes} nombre={mascota.nombre} />
            <MascotaInfo mascota={mascota} />
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold text-[#FA8072]">Historial</h2>
            {mascota.casos.length === 0 ? (
              <p className="text-center text-gray-500">
                Todavía no hay casos publicados para esta mascota.
              </p>
            ) : (
              mascota.casos.map((caso) => (
                <MascotaCasoHistorialCard key={caso.id} caso={caso} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
