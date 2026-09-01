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
    <article className="bg-[#fff1ea] rounded-2xl shadow-sm border border-[#6c2f00]/15 overflow-hidden font-body-editorial transition-all duration-300 hover:border-[#6c2f00]/30">
      {/* Header del post */}
      <div className="flex items-center gap-3 p-4 border-b border-[#6c2f00]/10">
        <Link href={`/ong/${caso.ong.id}`} className="shrink-0">
          {caso.ong.imagenPerfil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={caso.ong.imagenPerfil}
              alt={`Foto de perfil de ${caso.ong.nombre}`}
              className="w-11 h-11 object-cover rounded-full border-2 border-[#8b4513]"
            />
          ) : (
            <div className="w-11 h-11 rounded-full border-2 border-[#8b4513] bg-[#ffeade] flex items-center justify-center text-sm font-bold text-[#6c2f00]">
              {caso.ong.nombre.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={`/ong/${caso.ong.id}`}
            className="font-display-editorial font-semibold text-base text-[#6c2f00] hover:text-[#ae2f34] transition truncate block"
          >
            {caso.ong.nombre}
          </Link>
          <p className="text-xs text-[#54433a] truncate">
            {ubicacion ? `${ubicacion} · ` : ''}
            {formatearFecha(caso.creado_en)}
          </p>
        </div>

        <span
          className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-sm shrink-0 ${
            esAdopcion ? 'bg-[#934b19] text-white' : 'bg-[#ff6b6b] text-white'
          }`}
        >
          {esAdopcion ? 'En adopción' : 'Donación'}
        </span>
      </div>

      {/* Imagen del post */}
      <div className="relative w-full h-72 bg-[#ffeade] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagenUrl} alt={caso.mascota.nombre} className="w-full h-full object-cover" />
      </div>

      {/* Contenido del post */}
      <div className="p-6 flex flex-col gap-3">
        <h3 className="font-display-editorial text-2xl font-semibold text-[#6c2f00]">{caso.titulo}</h3>
        <p className="font-body-editorial text-sm text-[#54433a] line-clamp-3 leading-relaxed">{caso.descripcion}</p>

        <Link
          href={`/mascotas/${caso.mascota.id}`}
          className="mt-2 self-start font-semibold text-sm text-[#ae2f34] hover:text-[#6c2f00] transition flex items-center gap-1"
        >
          Ver a {caso.mascota.nombre} <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </article>
  )
}
