'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Caso } from '@/types/casos'
import { getMascotasEnAdopcion } from '@/services/mascotas'

export default function MascotasUrgentesWidget() {
  const [mascotas, setMascotas] = useState<Caso[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false

    async function cargar() {
      try {
        const data = await getMascotasEnAdopcion()
        if (!cancelado) {
          setMascotas(Array.isArray(data) ? data.slice(0, 3) : [])
        }
      } catch {
        if (!cancelado) setMascotas([])
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    cargar()

    return () => {
      cancelado = true
    }
  }, [])

  return (
    <div className="bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-5 shadow-sm font-body-editorial">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c85a32] text-xl">pets</span>
          <h4 className="font-serif font-bold text-sm text-[#6c2f00] dark:text-[#ffdbc9] uppercase tracking-wider">
            Esperando un Hogar
          </h4>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c85a32] bg-[#fff1ea] dark:bg-[#26262e] px-2 py-0.5 rounded-full border border-[#c85a32]/20">
          Urgente
        </span>
      </div>

      {cargando && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-[#fff8f5]/60 dark:bg-[#26262e]/40">
              <div className="w-14 h-14 rounded-xl bg-[#ffeade] dark:bg-[#26262e] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-[#ffeade] dark:bg-[#26262e] rounded" />
                <div className="h-3 w-16 bg-[#ffeade] dark:bg-[#26262e] rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!cargando && mascotas.length === 0 && (
        <p className="text-xs text-[#54433a]/80 dark:text-[#dac2b6]/80 text-center py-4">
          No hay casos urgentes de adopción en este momento.
        </p>
      )}

      {!cargando && mascotas.length > 0 && (
        <div className="space-y-3">
          {mascotas.map((caso) => {
            const imgUrl =
              caso.mascota.imagenes?.[0]?.url ||
              'https://via.placeholder.com/150?text=Mascota'
            return (
              <Link
                key={caso.id}
                href={`/mascotas/${caso.mascota.id}`}
                className="group flex items-center gap-3 p-2 rounded-xl hover:bg-[#ffeade]/60 dark:hover:bg-[#26262e] transition-all border border-transparent hover:border-[#6c2f00]/10 dark:hover:border-[#c85a32]/20"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#fff5f2] dark:bg-[#26262e] shrink-0 border border-[#6c2f00]/10 dark:border-[#c85a32]/20">
                  <Image
                    src={imgUrl}
                    alt={caso.mascota.nombre}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-300"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-serif font-bold text-sm text-[#6c2f00] dark:text-[#ffdbc9] group-hover:text-[#c85a32] dark:group-hover:text-[#c85a32] transition truncate">
                    {caso.mascota.nombre}
                  </h5>
                  <p className="text-xs text-[#54433a]/80 dark:text-[#dac2b6]/80 capitalize truncate">
                    {caso.mascota.tipo || 'En adopción'}
                  </p>
                  <span className="text-[10px] font-semibold text-[#c85a32] group-hover:underline flex items-center gap-0.5 mt-0.5">
                    Conocer historia →
                  </span>
                </div>
              </Link>
            )
          })}

          <div className="pt-2 border-t border-[#6c2f00]/10 dark:border-[#c85a32]/15">
            <Link
              href="/adoptar/adopcion"
              className="block text-center text-xs font-semibold text-[#c85a32] hover:text-[#a84320] dark:hover:text-[#ffdbc9] transition py-1"
            >
              Ver todos los animales en adopción →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
