import { MascotaCasoHistorial } from '@/types/mascotas'

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function MascotaCasoHistorialCard({ caso }: { caso: MascotaCasoHistorial }) {
  const esAdopcion = caso.tipo === 'ADOPCION'

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-[#ffcfc7] dark:border-zinc-700 p-5 flex flex-col gap-2">
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
      <p className="text-sm text-gray-600 dark:text-gray-300">{caso.descripcion}</p>
    </article>
  )
}
