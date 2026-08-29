import Image from 'next/image'
import Link from 'next/link'
import { CasoTimelineItem } from '@/types/casos'

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function TimelinePostCard({ caso }: { caso: CasoTimelineItem }) {
  const imagenUrl = caso.mascota.imagenes[0]?.url ?? 'https://via.placeholder.com/400x300?text=Mascota'
  const esAdopcion = caso.tipo === 'ADOPCION'

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-[#ffcfc7] dark:border-zinc-700 overflow-hidden flex flex-col sm:flex-row">
      <div className="relative w-full sm:w-56 h-48 shrink-0 bg-[#fff5f2]">
        <Image
          src={imagenUrl}
          alt={caso.mascota.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 224px"
        />
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
              esAdopcion ? 'bg-[#ffece8] text-[#FA8072]' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {esAdopcion ? 'En adopción' : 'Donación'}
          </span>
          <span className="text-xs text-gray-400">{formatearFecha(caso.creado_en)}</span>
        </div>

        <h3 className="text-lg font-bold text-[#FA8072]">{caso.titulo}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{caso.descripcion}</p>

        <Link
          href={`/mascotas/${caso.mascota.id}`}
          className="mt-auto self-start text-sm font-semibold text-[#FA8072] hover:text-[#e87366] transition"
        >
          Ver a {caso.mascota.nombre} →
        </Link>
      </div>
    </article>
  )
}
