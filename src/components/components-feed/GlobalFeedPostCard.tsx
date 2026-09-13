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

      {/* Imagen del post */}
      <div className="relative w-full h-72 bg-[#fff5f2] dark:bg-[#26262e] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagenUrl}
          alt={caso.mascota.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Contenido del post */}
      <div className="p-6 flex flex-col gap-3">
        <h3 className="font-display-editorial text-2xl font-semibold text-[#6c2f00] dark:text-[#ffdbc9] group-hover:text-[#c85a32] dark:group-hover:text-[#c85a32] transition">
          {caso.titulo}
        </h3>
        <p className="font-body-editorial text-sm text-[#54433a] dark:text-[#dac2b6] line-clamp-3 leading-relaxed">
          {caso.descripcion}
        </p>

        <Link
          href={`/mascotas/${caso.mascota.id}`}
          className="mt-2 self-start font-semibold text-sm text-[#c85a32] hover:text-[#a84320] dark:hover:text-[#ffdbc9] transition inline-flex items-center gap-1.5"
        >
          <span>Ver a {caso.mascota.nombre}</span>
          <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </div>
    </article>
  )
}
