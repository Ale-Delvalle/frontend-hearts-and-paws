'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MascotaPerdida, FiltrosMascotasPerdidas } from '@/types/mascotaPerdida';
import { getMascotasPerdidas } from '@/services/mascotasPerdidasService';
import MascotaPerdidaCard from './MascotaPerdidaCard';
import MascotasPerdidasFiltros from './MascotasPerdidasFiltros';

export default function MascotasPerdidasListado() {
  const [publicaciones, setPublicaciones] = useState<MascotaPerdida[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [filtros, setFiltros] = useState<FiltrosMascotasPerdidas>({
    page: 1,
    limit: 12,
  });

  const cargarPublicaciones = useCallback(async (f: FiltrosMascotasPerdidas) => {
    setCargando(true);
    setError('');
    try {
      const res = await getMascotasPerdidas(f);
      setPublicaciones(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      setPagina(res.page || 1);
    } catch (err: any) {
      console.error('Error al cargar mascotas perdidas:', err);
      setError('No se pudieron cargar las publicaciones. Por favor, intentá nuevamente.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPublicaciones(filtros);
  }, [filtros, cargarPublicaciones]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosMascotasPerdidas) => {
    setFiltros(nuevosFiltros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({ page: 1, limit: 12 });
  };

  const handlePaginaCambio = (nuevaPagina: number) => {
    setFiltros((prev) => ({ ...prev, page: nuevaPagina }));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial py-12 px-6 sm:px-10 lg:px-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff1ea] via-white to-[#ffe7dc] dark:from-[#1c1c21] dark:via-[#16161a] dark:to-[#261c16] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c85a32]/10 dark:bg-[#c85a32]/20 border border-[#c85a32]/20 text-[#c85a32] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">travel_explore</span>
              Red Solidaria Hearts&Paws
            </div>

            <h1 className="font-display-editorial text-4xl sm:text-5xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] tracking-tight leading-tight">
              Mascotas Perdidas y Encontradas
            </h1>

            <p className="text-sm sm:text-base text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
              Un espacio dedicado para que familias y ONGs publiquen animales extraviados o rescatados en la calle. Juntos multiplicamos las posibilidades de que vuelvan a su hogar.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                href="/mascotas-perdidas/nueva"
                className="inline-flex items-center gap-2 bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">campaign</span>
                <span>Publicar mascota perdida</span>
              </Link>
              <span className="text-xs text-[#54433a]/80 dark:text-[#dac2b6]/80 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#c85a32]">check_circle</span>
                Abierto a Usuarios y ONGs
              </span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <MascotasPerdidasFiltros
          filtros={filtros}
          onChange={handleFiltrosChange}
          onLimpiar={handleLimpiarFiltros}
        />

        {/* Mensaje de Error */}
        {error && (
          <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-center text-red-700 dark:text-red-300 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Estado de Carga (Skeleton) */}
        {cargando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-[#1c1c21] rounded-3xl p-5 border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 shadow-sm animate-pulse space-y-4"
              >
                <div className="w-full h-52 bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-2xl" />
                <div className="h-6 w-3/4 bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-full" />
                <div className="h-4 w-full bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-full" />
                <div className="h-4 w-1/2 bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Grilla de Publicaciones */}
        {!cargando && !error && publicaciones.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#54433a] dark:text-[#dac2b6] px-1">
              <span>Mostrando {publicaciones.length} de {total} publicaciones</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicaciones.map((pub) => (
                <MascotaPerdidaCard key={pub.id} publicacion={pub} />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => handlePaginaCambio(pagina - 1)}
                  disabled={pagina <= 1}
                  className="px-4 py-2 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#fff1ea] dark:hover:bg-[#26262e] text-xs font-semibold transition"
                >
                  Anterior
                </button>
                <span className="text-xs font-bold text-[#6c2f00] dark:text-[#ffdbc9] px-3">
                  Página {pagina} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => handlePaginaCambio(pagina + 1)}
                  disabled={pagina >= totalPages}
                  className="px-4 py-2 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#fff1ea] dark:hover:bg-[#26262e] text-xs font-semibold transition"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}

        {/* Estado Vacío */}
        {!cargando && !error && publicaciones.length === 0 && (
          <div className="bg-white dark:bg-[#1c1c21] rounded-3xl p-12 text-center border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#fff1ea] dark:bg-[#2b170f] border border-[#c85a32]/25 text-[#c85a32] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">sentiment_satisfied</span>
            </div>
            <h3 className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
              No se encontraron publicaciones
            </h3>
            <p className="text-xs text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
              No hay mascotas perdidas que coincidan con los filtros aplicados en este momento.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={handleLimpiarFiltros}
                className="px-5 py-2.5 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] transition"
              >
                Restablecer filtros
              </button>
              <Link
                href="/mascotas-perdidas/nueva"
                className="px-5 py-2.5 rounded-full bg-[#c85a32] hover:bg-[#a84320] text-white text-xs font-semibold shadow-xs transition"
              >
                Crear nueva publicación
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
