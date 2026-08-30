import Image from 'next/image'
import Link from 'next/link'
import { CasoFeedItem } from '@/types/casos'

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function GlobalFeedPostCard({ caso }: { caso: CasoFeedItem }) {
  const imagenUrl = caso.mascota.imagenes[0]?.url ?? 'https://via.placeholder.com/400x300?text=Mascota'
  const esAdopcion = caso.tipo === 'ADOPCION'
  const ubicacion = [caso.ong.ciudad, caso.ong.pais].filter(Boolean).join(', ')

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-[#ffcfc7] dark:border-zinc-700 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Link href={`/ong/${caso.ong.id}`} className="shrink-0">
          {caso.ong.imagenPerfil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={caso.ong.imagenPerfil}
              alt={`Foto de perfil de ${caso.ong.nombre}`}
              className="w-11 h-11 object-cover rounded-full border-2 border-[#e87366]"
            />
          ) : (
            <div className="w-11 h-11 rounded-full border-2 border-[#e87366] bg-[#ffece8] flex items-center justify-center text-sm font-bold text-[#FA8072]">
              {caso.ong.nombre.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={`/ong/${caso.ong.id}`}
            className="font-semibold text-sm text-gray-900 dark:text-gray-100 hover:text-[#FA8072] transition truncate block"
          >
            {caso.ong.nombre}
          </Link>
          <p className="text-xs text-gray-400 truncate">
            {ubicacion ? `${ubicacion} · ` : ''}
            {formatearFecha(caso.creado_en)}
          </p>
        </div>

        <span
          className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shrink-0 ${
            esAdopcion ? 'bg-[#ffece8] text-[#FA8072]' : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {esAdopcion ? 'En adopción' : 'Donación'}
        </span>
      </div>

      <div className="relative w-full h-64 bg-[#fff5f2]">
        <Image
          src={imagenUrl}
          alt={caso.mascota.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 640px"
        />
      </div>

      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-[#FA8072]">{caso.titulo}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{caso.descripcion}</p>

        <Link
          href={`/mascotas/${caso.mascota.id}`}
          className="mt-1 self-start text-sm font-semibold text-[#FA8072] hover:text-[#e87366] transition"
        >
          Ver a {caso.mascota.nombre} →
        </Link>
      </div>
    </article>
  )
}
