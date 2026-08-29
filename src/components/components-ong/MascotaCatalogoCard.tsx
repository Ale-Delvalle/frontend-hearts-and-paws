import Image from 'next/image'
import Link from 'next/link'
import { MascotaCatalogoItem } from '@/types/mascotas'
import { ESTADOS_MASCOTA } from '@/lib/estadoMascota'

export default function MascotaCatalogoCard({ mascota }: { mascota: MascotaCatalogoItem }) {
  const imagenUrl = mascota.imagenes[0]?.url ?? 'https://via.placeholder.com/400x300?text=Mascota'
  const estado = ESTADOS_MASCOTA[mascota.estado]

  return (
    <Link
      href={`/mascotas/${mascota.id}`}
      className="group bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-[#ffcfc7] dark:border-zinc-700 overflow-hidden flex flex-col transition hover:shadow-lg"
    >
      <div className="relative w-full h-40 bg-[#fff5f2]">
        <Image
          src={imagenUrl}
          alt={mascota.nombre}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
          sizes="(max-width: 640px) 50vw, 220px"
        />
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${estado.className}`}
        >
          {estado.label}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-[#FA8072] truncate">{mascota.nombre}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{mascota.tipo.nombre}</p>
      </div>
    </Link>
  )
}
