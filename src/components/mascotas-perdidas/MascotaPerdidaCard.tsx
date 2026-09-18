'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MascotaPerdida } from '@/types/mascotaPerdida';

interface MascotaPerdidaCardProps {
  publicacion: MascotaPerdida;
}

export default function MascotaPerdidaCard({ publicacion }: MascotaPerdidaCardProps) {
  const {
    id,
    nombre,
    tipo,
    descripcion,
    ubicacion,
    ciudad,
    imagenUrl,
    recompensa,
    estado,
    fechaPerdido,
    usuario,
    organizacion,
  } = publicacion;

  const autorNombre = organizacion?.nombre || usuario?.nombre || 'Comunidad Hearts&Paws';
  const esOng = Boolean(organizacion);

  const getBadgeEstado = () => {
    switch (estado) {
      case 'REUNIDO':
        return {
          label: '¡Reunido con su familia! 🎉',
          className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        };
      case 'ENCONTRADO':
        return {
          label: 'Encontrado / Buscando dueño',
          className: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        };
      case 'PERDIDO':
      default:
        return {
          label: 'Extraviado / Perdido',
          className: 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-700',
        };
    }
  };

  const badge = getBadgeEstado();

  let fechaFormateada = 'Fecha no especificada';
  try {
    const f = new Date(fechaPerdido);
    if (!isNaN(f.getTime())) {
      fechaFormateada = f.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  } catch {
    fechaFormateada = fechaPerdido;
  }

  return (
    <div className="group bg-white dark:bg-[#1c1c21] rounded-3xl overflow-hidden border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between font-body-editorial">
      <div>
        {/* Contenedor de Imagen */}
        <div className="relative w-full h-56 bg-[#fff1ea] dark:bg-[#26262e] overflow-hidden">
          {imagenUrl ? (
            <Image
              src={imagenUrl}
              alt={nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#54433a]/50 dark:text-[#dac2b6]/50 gap-2">
              <span className="material-symbols-outlined text-5xl text-[#c85a32]/60">pets</span>
              <span className="text-xs font-semibold">Sin foto disponible</span>
            </div>
          )}

          {/* Badge de Estado flotante */}
          <span
            className={`absolute top-3.5 left-3.5 text-xs font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-xs ${badge.className}`}
          >
            {badge.label}
          </span>

          {/* Badge de Recompensa si existe */}
          {recompensa && (
            <span className="absolute top-3.5 right-3.5 bg-yellow-400 text-yellow-950 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">monetization_on</span>
              <span>Recompensa</span>
            </span>
          )}
        </div>

        {/* Cuerpo de la Card */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] group-hover:text-[#c85a32] dark:group-hover:text-[#c85a32] transition-colors truncate">
              {nombre}
            </h3>
            <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#fff1ea] dark:bg-[#121214] text-[#c85a32] dark:text-[#ffdbc9] text-xs font-semibold border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
              {tipo}
            </span>
          </div>

          <p className="text-xs text-[#54433a] dark:text-[#dac2b6] line-clamp-2 leading-relaxed">
            {descripcion}
          </p>

          <div className="space-y-1.5 pt-2 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 text-xs text-[#54433a] dark:text-[#dac2b6]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#c85a32] shrink-0">
                location_on
              </span>
              <span className="truncate">
                {ubicacion} {ciudad ? `· ${ciudad}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#c85a32] shrink-0">
                calendar_today
              </span>
              <span>Visto el {fechaFormateada}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#c85a32] shrink-0">
                {esOng ? 'corporate_fare' : 'person'}
              </span>
              <span className="truncate">
                {esOng ? `ONG: ${autorNombre}` : `Por ${autorNombre}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer de la Card */}
      <div className="p-5 sm:p-6 pt-0">
        <Link
          href={`/mascotas-perdidas/${id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#fff1ea] dark:bg-[#26262e] hover:bg-[#c85a32] text-[#6c2f00] dark:text-[#ffdbc9] hover:text-white dark:hover:text-white font-semibold text-xs py-3 px-4 rounded-full border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 hover:border-transparent transition-all duration-300 shadow-xs cursor-pointer"
        >
          <span>Ver ficha y contactar</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
