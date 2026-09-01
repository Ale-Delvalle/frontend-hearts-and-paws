'use client'

import { MascotaCardConModoProps } from '@/types/mascotas'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { putAgregarAFavoritos, getFavoritosPorUsuario } from '@/services/favoritos'
import { getDetalleDonacionPorCaso } from '@/services/donacion'
import type { DetalleDonacion } from '@/types/detalledonacion'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '../SupabaseProvider'

interface FavoritoItem {
  caso: { id: string }
}

interface Props extends MascotaCardConModoProps {
  mostrarFavorito?: boolean
}

export default function MascotaCard({
  mascota,
  onConocerHistoria,
  onAdoptar,
  modo,
  mostrarFavorito = true,
}: Props) {
  const { usuario } = useUsuarioAuth()
  const { token } = useAuth()
  const router = useRouter()

  const [esFavorito, setEsFavorito] = useState(false)
  const [detalleDonacion, setDetalleDonacion] = useState<DetalleDonacion | null>(null)
  const [imagenActual, setImagenActual] = useState(0)
  const totalImagenes = mascota.imagenes?.length ?? 0

  const irAAnterior = () => setImagenActual((prev) => (prev === 0 ? totalImagenes - 1 : prev - 1))
  const irASiguiente = () => setImagenActual((prev) => (prev === totalImagenes - 1 ? 0 : prev + 1))

  const textoBotonAccion = modo === 'adopcion' ? 'Adoptar' : 'Donar'

  const getUserId = async () => {
    if (usuario?.id) return usuario.id
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.user?.id || null
    } catch {
      return null
    }
  }

  const handleAccion = async () => {
    const userId = await getUserId()
    if (!userId) {
      toast.error('Necesitás iniciar sesión para continuar.')
      router.push('/login')
      return
    }
    onAdoptar?.(mascota.casoId)
  }

  const toggleFavorito = async () => {
    try {
      await putAgregarAFavoritos( mascota.casoId, token ?? undefined)
      setEsFavorito((prev) => !prev)
      toast.success(!esFavorito ? 'Agregado a favoritos' : 'Eliminado de favoritos')
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar el favorito.')
    }
  }

  useEffect(() => {
    if (!token) return

    const cargarFavoritos = async () => {
      try {
        const favoritos: FavoritoItem[] = await getFavoritosPorUsuario(token)
        const estaEnFavoritos = favoritos.some((f) => f.caso.id === mascota.casoId)
        setEsFavorito(estaEnFavoritos)
      } catch (error) {
        console.error('Error al cargar favoritos', error)
      }
    }

    cargarFavoritos()
  }, [mascota.casoId, token])

  useEffect(() => {
    if (modo !== 'donacion') return

    const cargarDonacion = async () => {
      try {
        const detalle = await getDetalleDonacionPorCaso(mascota.casoId,token?? undefined)
        setDetalleDonacion(detalle)
      } catch (error) {
        console.error('Error al cargar meta de donación', error)
      }
    }

    cargarDonacion()
  }, [modo, mascota.casoId,token])

  const recaudado = detalleDonacion?.estadoDonacion ?? 0
  const meta = detalleDonacion?.metaDonacion ?? 0
  const porcentaje = meta > 0 ? Math.min((recaudado / meta) * 100, 100) : 0
  const metaAlcanzada = recaudado >= meta

  return (
    <article className="bg-white rounded-2xl border border-[#6c2f00]/15 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative group">
      {/* Botón de Favoritos en la esquina superior derecha de la imagen */}
      {mostrarFavorito && (
        <button
          onClick={toggleFavorito}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#ff6b6b] hover:bg-white hover:scale-110 transition-all shadow-xs cursor-pointer"
          aria-label="Marcar como favorito"
          type="button"
        >
          {esFavorito ? <FaHeart className="text-base text-[#ff6b6b]" /> : <FaRegHeart className="text-base text-[#ff6b6b]" />}
        </button>
      )}

      {/* Contenedor Destacado de Imagen */}
      <div className="relative w-full h-64 sm:h-72 bg-[#6c2f00]/5 overflow-hidden">
        {totalImagenes > 0 ? (
          <Image
            src={mascota.imagenes[imagenActual]?.url}
            alt={mascota.nombre}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#6c2f00]/30">
            <span className="material-symbols-outlined text-4xl mb-1">pets</span>
            <span className="font-body-editorial text-xs">Sin foto disponible</span>
          </div>
        )}

        {/* Flechas de Navegación si hay múltiples imágenes */}
        {totalImagenes > 1 && (
          <>
            <button
              onClick={irAAnterior}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6c2f00] bg-white/90 backdrop-blur-md rounded-full shadow-xs p-2 hover:bg-white transition-all z-10 cursor-pointer"
              type="button"
              aria-label="Imagen anterior"
            >
              <span className="material-symbols-outlined text-sm block">chevron_left</span>
            </button>
            <button
              onClick={irASiguiente}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c2f00] bg-white/90 backdrop-blur-md rounded-full shadow-xs p-2 hover:bg-white transition-all z-10 cursor-pointer"
              type="button"
              aria-label="Imagen siguiente"
            >
              <span className="material-symbols-outlined text-sm block">chevron_right</span>
            </button>
          </>
        )}
      </div>

      {/* Cuerpo de la Tarjeta Editorial */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Título de la Mascota */}
          <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] mb-2 leading-tight">
            {mascota.nombre || "Sin nombre"}
          </h2>

          {/* Descripción Breve */}
          <p className="font-body-editorial text-sm text-[#54433a] leading-relaxed line-clamp-3 mb-4">
            {mascota.descripcion || "Un compañero amoroso que busca una segunda oportunidad y un hogar lleno de cariño."}
          </p>

          {/* Progreso de Donación si aplica */}
          {modo === 'donacion' && detalleDonacion && (
            <div className="mb-4 p-3 rounded-xl bg-[#fff1ea] border border-[#6c2f00]/10">
              <div className="flex justify-between text-xs text-[#54433a] font-semibold mb-1 font-body-editorial">
                <span>Recaudado: {detalleDonacion.estadoDonacionARS}</span>
                <span>Meta: {detalleDonacion.metaDonacionARS}</span>
              </div>

              <div className="relative w-full bg-[#6c2f00]/10 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    metaAlcanzada ? 'bg-[#2e5d32]' : 'bg-[#ae2f34]'
                  }`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bloque Inferior: Metadata y Botones de Acción */}
        <div>
          {/* Fila Informativa (Edad & Refugio/ONG) */}
          <div className="border-t border-[#6c2f00]/10 pt-3 mb-4 flex items-center justify-between text-xs text-[#54433a] font-semibold font-body-editorial">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6c2f00]">calendar_today</span>
              {mascota.tipo === 'gato' ? 'Joven' : 'Adulto'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#6c2f00]">location_on</span>
              Refugio Aliado
            </span>
          </div>

          {/* Botones de Acción Solicitados */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onConocerHistoria?.(mascota)}
              className="flex-1 bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-body-editorial text-xs font-semibold py-2.5 px-3 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-base">menu_book</span>
              <span>Conocer historia</span>
            </button>

            <button
              onClick={handleAccion}
              className={`flex-1 border border-[#6c2f00]/30 hover:bg-[#ffeade] text-[#6c2f00] font-body-editorial text-xs font-semibold py-2.5 px-3 rounded-full transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                modo === 'donacion' && metaAlcanzada
                  ? 'opacity-60 cursor-not-allowed border-gray-300'
                  : ''
              }`}
              type="button"
              disabled={modo === 'donacion' && metaAlcanzada}
            >
              <span className="material-symbols-outlined text-base">
                {modo === 'adopcion' ? 'pets' : 'favorite'}
              </span>
              <span>
                {modo === 'donacion' && metaAlcanzada ? '¡Alcanzada!' : textoBotonAccion}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
