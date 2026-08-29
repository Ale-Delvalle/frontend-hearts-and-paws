import Link from 'next/link'
import { MascotaPerfil } from '@/types/mascotas'
import { ESTADOS_MASCOTA } from '@/lib/estadoMascota'

export default function MascotaInfo({ mascota }: { mascota: MascotaPerfil }) {
  const estado = ESTADOS_MASCOTA[mascota.estado]

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-[#ffcfc7] dark:border-zinc-700 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#FA8072] leading-tight">{mascota.nombre}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mascota.tipo.nombre} · {mascota.edad} {mascota.edad === 1 ? 'año' : 'años'}
          </p>
        </div>
        <span
          className={`shrink-0 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${estado.className}`}
        >
          {estado.label}
        </span>
      </div>

      {mascota.descripcion && (
        <p className="text-sm text-gray-600 dark:text-gray-300">{mascota.descripcion}</p>
      )}

      <Link
        href={`/ong/${mascota.organizacion.id}`}
        className="group flex items-center gap-3 mt-2 pt-4 border-t border-[#ffcfc7] dark:border-zinc-700"
      >
        {mascota.organizacion.imagenPerfil ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mascota.organizacion.imagenPerfil}
            alt={mascota.organizacion.nombre}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#e87366]"
          />
        ) : (
          <div className="w-10 h-10 rounded-full border-2 border-[#e87366] bg-[#ffece8] flex items-center justify-center text-sm font-bold text-[#FA8072]">
            {mascota.organizacion.nombre.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-xs text-gray-400">Publicado por</p>
          <p className="text-sm font-semibold text-[#FA8072] group-hover:text-[#e87366] transition">
            {mascota.organizacion.nombre}
          </p>
        </div>
      </Link>
    </div>
  )
}
