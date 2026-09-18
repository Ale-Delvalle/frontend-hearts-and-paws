'use client';

import React from 'react';
import { FiltrosMascotasPerdidas } from '@/types/mascotaPerdida';

interface MascotasPerdidasFiltrosProps {
  filtros: FiltrosMascotasPerdidas;
  onChange: (nuevosFiltros: FiltrosMascotasPerdidas) => void;
  onLimpiar: () => void;
}

export default function MascotasPerdidasFiltros({
  filtros,
  onChange,
  onLimpiar,
}: MascotasPerdidasFiltrosProps) {
  const handleEstadoClick = (estado: string) => {
    onChange({
      ...filtros,
      estado: filtros.estado === estado ? undefined : estado,
      page: 1,
    });
  };

  const estadosBotones = [
    { key: '', label: 'Todos' },
    { key: 'PERDIDO', label: '🔍 Perdidos' },
    { key: 'ENCONTRADO', label: '🏠 Encontrados' },
    { key: 'REUNIDO', label: '🎉 Reunidos' },
  ];

  const tipos = ['Perro', 'Gato', 'Ave', 'Otro'];

  return (
    <div className="bg-white dark:bg-[#1c1c21] rounded-3xl p-6 border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-sm space-y-5 font-body-editorial">
      {/* Buscador general */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#54433a] dark:text-[#dac2b6] text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, seña particular, barrio o zona..."
            value={filtros.search || ''}
            onChange={(e) => onChange({ ...filtros, search: e.target.value, page: 1 })}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] placeholder:text-[#54433a]/60 dark:placeholder:text-[#dac2b6]/60 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
          />
        </div>

        {/* Input Ciudad */}
        <div className="relative w-full sm:w-60">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#54433a] dark:text-[#dac2b6] text-xl">
            location_city
          </span>
          <input
            type="text"
            placeholder="Filtrar por ciudad..."
            value={filtros.ciudad || ''}
            onChange={(e) => onChange({ ...filtros, ciudad: e.target.value, page: 1 })}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] placeholder:text-[#54433a]/60 dark:placeholder:text-[#dac2b6]/60 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
          />
        </div>

        {(filtros.search || filtros.estado || filtros.tipo || filtros.ciudad) && (
          <button
            type="button"
            onClick={onLimpiar}
            className="shrink-0 px-4 py-3 rounded-full text-xs font-semibold text-[#c85a32] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] border border-[#c85a32]/30 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filtro por Estado y Especie */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
        {/* Pestañas de Estado */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#54433a] dark:text-[#dac2b6] mr-1 uppercase tracking-wider">
            Estado:
          </span>
          {estadosBotones.map((btn) => {
            const isActive =
              (!filtros.estado && btn.key === '') || filtros.estado === btn.key;
            return (
              <button
                key={btn.key}
                type="button"
                onClick={() => handleEstadoClick(btn.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#c85a32] text-white shadow-xs'
                    : 'bg-[#fff8f5] dark:bg-[#121214] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 hover:bg-[#fff1ea] dark:hover:bg-[#26262e]'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Selector de Especie */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#54433a] dark:text-[#dac2b6] uppercase tracking-wider">
            Especie:
          </span>
          <select
            value={filtros.tipo || ''}
            onChange={(e) => onChange({ ...filtros, tipo: e.target.value || undefined, page: 1 })}
            className="px-3.5 py-1.5 rounded-full bg-[#fff8f5] dark:bg-[#121214] text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 focus:outline-none focus:ring-2 focus:ring-[#c85a32] cursor-pointer"
          >
            <option value="">Todas las especies</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
