'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MascotaPerfil } from '@/types/mascotas'

type Props = {
  imagenes: MascotaPerfil['imagenes']
  nombre: string
}

export default function MascotaGaleria({ imagenes, nombre }: Props) {
  const [indice, setIndice] = useState(0)
  const [revelarSensible, setRevelarSensible] = useState<Record<number, boolean>>({})

  if (imagenes.length === 0) {
    return (
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#ffece8] flex items-center justify-center">
        <span className="text-[#FA8072] font-semibold">Sin fotos todavía</span>
      </div>
    )
  }

  const actual = imagenes[indice]
  const mostrarBlur = Boolean(actual.esSensible) && !revelarSensible[indice]
  const urlAMostrar = mostrarBlur ? actual.urlBlur ?? actual.url : actual.url

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#fff5f2] shadow-md border border-[#ffcfc7] dark:border-zinc-700">
        <Image
          src={urlAMostrar}
          alt={nombre}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 420px"
        />

        {mostrarBlur && (
          <button
            onClick={() => setRevelarSensible((prev) => ({ ...prev, [indice]: true }))}
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-semibold px-6 text-center"
            type="button"
          >
            Esta imagen puede contener contenido sensible.
            <br />
            Tocá para verla igual.
          </button>
        )}

        {imagenes.length > 1 && (
          <>
            <button
              onClick={() => setIndice((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FA8072] text-xl bg-white rounded-full shadow p-2 hover:bg-[#ffece8] transition"
              type="button"
              aria-label="Foto anterior"
            >
              ◀
            </button>
            <button
              onClick={() => setIndice((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FA8072] text-xl bg-white rounded-full shadow p-2 hover:bg-[#ffece8] transition"
              type="button"
              aria-label="Foto siguiente"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIndice(i)}
              className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                i === indice ? 'border-[#FA8072]' : 'border-transparent'
              }`}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
            >
              <Image
                src={img.esSensible ? img.urlBlur ?? img.url : img.url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
