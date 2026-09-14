'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { CasoFeedItem } from '@/types/casos'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { useAuth } from '@/components/SupabaseProvider'

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function GlobalFeedPostCard({ caso }: { caso: CasoFeedItem }) {
  const router = useRouter()
  const { usuario } = useUsuarioAuth()
  const { user } = useAuth()

  const imagenUrl = caso.mascota.imagenes[0]?.url ?? 'https://via.placeholder.com/400x300?text=Mascota'
  const esAdopcion = caso.tipo === 'ADOPCION'
  const ubicacion = [caso.ong.ciudad, caso.ong.pais].filter(Boolean).join(', ')

  const handleAdoptar = () => {
    if (!usuario && !user) {
      toast.error('Necesitás iniciar sesión para postularte a la adopción.')
      router.push('/login')
      return
    }
    router.push(`/adoptar/formulario-adopcion?id=${caso.mascota.id}`)
  }

  const handleDonar = () => {
    router.push('/donacion')
  }

  const porcentajeDonacion =
    caso.donacion && caso.donacion.metaDonacion > 0
      ? Math.min(100, Math.round((caso.donacion.estadoDonacion / caso.donacion.metaDonacion) * 100))
      : null

  return (
    <article className="group bg-white dark:bg-[#1c1c21] rounded-2xl shadow-sm hover:shadow-md border border-[#6c2f00]/15 dark:border-[#c85a32]/25 overflow-hidden font-body-editorial transition-all duration-300">
      {/* Header del post */}
      <div className="flex items-center gap-3 p-4 border-b border-[#6c2f00]/10 dark:border-[#c85a32]/15">
        <Link href={`/ong/${caso.ong.id}`} className="shrink-0">
          {caso.ong.imagenPerfil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={caso.ong.imagenPerfil}
              alt={`Foto de perfil de ${caso.ong.nombre}`}
              className="w-11 h-11 object-cover rounded-full border-2 border-[#c85a32]"
            />
          ) : (
            <div className="w-11 h-11 rounded-full border-2 border-[#c85a32] bg-[#ffeade] dark:bg-[#26262e] flex items-center justify-center text-sm font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
              {caso.ong.nombre.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={`/ong/${caso.ong.id}`}
            className="font-display-editorial font-semibold text-base text-[#6c2f00] dark:text-[#ffdbc9] hover:text-[#c85a32] dark:hover:text-[#c85a32] transition truncate block"
          >
            {caso.ong.nombre}
          </Link>
          <p className="text-xs text-[#54433a]/80 dark:text-[#dac2b6]/80 truncate">
            {ubicacion ? `${ubicacion} · ` : ''}
            {formatearFecha(caso.creado_en)}
          </p>
        </div>

        <span
          className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border shrink-0 ${
            esAdopcion
              ? 'bg-[#ffeade] text-[#934b19] border-[#934b19]/20 dark:bg-[#934b19]/30 dark:text-[#ffdbc9] dark:border-[#934b19]/40'
              : 'bg-emerald-50 text-emerald-700 border-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600/30'
          }`}
        >
          {esAdopcion ? 'En adopción' : 'Donación'}
        </span>
      </div>

      {/* Imagen del post con enlace a la ficha */}
      <Link
        href={`/mascotas/${caso.mascota.id}`}
        className="block relative w-full h-72 bg-[#fff5f2] dark:bg-[#26262e] overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagenUrl}
          alt={caso.mascota.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </Link>

      {/* Contenido del post */}
      <div className="p-6 flex flex-col gap-4">
        <div>
          <Link href={`/mascotas/${caso.mascota.id}`}>
            <h3 className="font-display-editorial text-2xl font-semibold text-[#6c2f00] dark:text-[#ffdbc9] hover:text-[#c85a32] dark:hover:text-[#c85a32] transition">
              {caso.titulo}
            </h3>
          </Link>
          <p className="mt-2 font-body-editorial text-sm text-[#54433a] dark:text-[#dac2b6] line-clamp-3 leading-relaxed">
            {caso.descripcion}
          </p>
        </div>

        {/* Indicador de donación si aplica */}
        {caso.donacion && (
          <div className="p-3.5 rounded-xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9]">
              <span>Recaudado: ${caso.donacion.estadoDonacion.toLocaleString('es-AR')}</span>
              <span>Meta: ${caso.donacion.metaDonacion.toLocaleString('es-AR')}</span>
            </div>
            {porcentajeDonacion !== null && (
              <div className="w-full h-2.5 bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c85a32] to-[#81c784] rounded-full transition-all duration-500"
                  style={{ width: `${porcentajeDonacion}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Barra de Acciones: Botones Adoptar, Donar y Ver Detalle */}
        <div className="pt-2 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Botón Adoptar */}
            <button
              onClick={handleAdoptar}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                esAdopcion
                  ? 'bg-[#c85a32] hover:bg-[#a84320] text-white'
                  : 'border border-[#c85a32] text-[#c85a32] hover:bg-[#c85a32] hover:text-white bg-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-base">pets</span>
              <span>Adoptar</span>
            </button>

            {/* Botón Donar */}
            <button
              onClick={handleDonar}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                !esAdopcion
                  ? 'bg-[#c85a32] hover:bg-[#a84320] text-white'
                  : 'border border-[#c85a32] text-[#c85a32] hover:bg-[#c85a32] hover:text-white bg-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-base">favorite</span>
              <span>Donar</span>
            </button>
          </div>

          {/* Enlace para ver perfil completo */}
          <Link
            href={`/mascotas/${caso.mascota.id}`}
            className="font-semibold text-xs text-[#c85a32] hover:text-[#a84320] dark:hover:text-[#ffdbc9] transition inline-flex items-center gap-1"
          >
            <span>Ver a {caso.mascota.nombre}</span>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}
