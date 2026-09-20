'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  getMascotasPerdidasPendientes,
  moderarMascotaPerdida,
} from '@/services/mascotasPerdidasService';
import { MascotaPerdida } from '@/types/mascotaPerdida';
import Footer from '../Footer';

export default function MascotasPerdidasPendientes() {
  const [publicaciones, setPublicaciones] = useState<MascotaPerdida[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const cargar = useCallback(async (pagina: number) => {
    setLoading(true);
    try {
      const res = await getMascotasPerdidasPendientes(pagina);
      setPublicaciones(res.data);
      setTotalPages(Math.max(1, res.totalPages));
      setTotal(res.total);
    } catch (error) {
      console.error('Error cargando publicaciones pendientes:', error);
      toast.error('No se pudieron cargar las publicaciones pendientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar(page);
  }, [cargar, page]);

  const handleDecision = async (id: string, decision: 'APROBADA' | 'RECHAZADA') => {
    setProcesandoId(id);
    try {
      await moderarMascotaPerdida(id, decision);
      toast.success(
        decision === 'APROBADA' ? 'Publicación aprobada.' : 'Publicación rechazada.'
      );
      // Si era la última de la página, retrocede; si no, recarga la actual.
      if (publicaciones.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await cargar(page);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Hubo un error. Intenta nuevamente.');
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial flex flex-col selection:bg-[#c85a32] selection:text-white">
      <div className="flex-grow max-w-[1280px] mx-auto px-6 md:px-12 py-12 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff1ea] dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base text-[#c85a32]">pending_actions</span>
            Moderación
          </div>
          <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl text-[#6c2f00] dark:text-[#ffdbc9] font-bold tracking-tight mb-4 leading-[1.1]">
            Mascotas perdidas pendientes
          </h1>
          <p className="text-base sm:text-lg text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
            Revisa las publicaciones de mascotas perdidas o encontradas y decide si se muestran al público.
            {total > 0 && ` Hay ${total} pendiente${total === 1 ? '' : 's'}.`}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-[#6c2f00] dark:text-[#ffdbc9] gap-3">
            <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
            <p className="font-semibold text-sm">Cargando publicaciones pendientes...</p>
          </div>
        ) : publicaciones.length === 0 ? (
          <div className="p-12 text-center text-[#54433a] dark:text-[#dac2b6] bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-2xl shadow-xs max-w-xl mx-auto">
            <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#ffdbc9] text-4xl mb-3">task_alt</span>
            <h3 className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-2">Todo al día</h3>
            <p className="text-sm">No hay publicaciones de mascotas perdidas pendientes de aprobación.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {publicaciones.map((pub) => {
              const autor = pub.organizacion?.nombre || pub.usuario?.nombre || 'Sin autor';
              const procesando = procesandoId === pub.id;

              return (
                <div
                  key={pub.id}
                  className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-6 md:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8"
                >
                  {pub.imagenUrl ? (
                    <img
                      src={pub.imagenUrl}
                      alt={`Foto de ${pub.nombre}`}
                      className="w-32 h-32 md:w-36 md:h-36 object-cover border-4 border-[#fff1ea] dark:border-[#121214] rounded-2xl shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-[#fff1ea] dark:bg-[#26262e] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-5xl text-[#c85a32]/50">pets</span>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
                          {pub.nombre}
                        </h2>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#fff1ea] dark:bg-[#26262e] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15">
                          {pub.estado === 'PERDIDO' ? 'Perdido' : pub.estado === 'ENCONTRADO' ? 'Encontrado' : 'Reunido'}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#fff1ea] dark:bg-[#26262e] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15">
                          {pub.tipo}
                        </span>
                      </div>

                      <p className="text-sm text-[#54433a] dark:text-[#dac2b6] leading-relaxed mb-3 line-clamp-3">
                        {pub.descripcion}
                      </p>

                      <div className="space-y-1 mb-4 text-sm text-[#54433a] dark:text-[#dac2b6]">
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-[#6c2f00] dark:text-[#ffdbc9]">location_on</span>
                          {pub.ubicacion}
                          {pub.ciudad ? `, ${pub.ciudad}` : ''}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-[#6c2f00] dark:text-[#ffdbc9]">person</span>
                          <span className="font-bold text-[#6c2f00] dark:text-[#ffdbc9]">Publicado por:</span> {autor}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-[#6c2f00] dark:text-[#ffdbc9]">calendar_month</span>
                          {new Date(pub.creado_en).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/15">
                      <button
                        onClick={() => handleDecision(pub.id, 'APROBADA')}
                        disabled={procesando}
                        className="bg-[#2e5d32] hover:bg-[#1b431e] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleDecision(pub.id, 'RECHAZADA')}
                        disabled={procesando}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-base">cancel</span>
                        Rechazar
                      </button>
                      <Link
                        href={`/mascotas-perdidas/${pub.id}`}
                        className="text-xs font-semibold px-5 py-2.5 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] transition flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9] disabled:opacity-40 cursor-pointer"
                >
                  Anterior
                </button>
                <span className="text-xs font-semibold text-[#54433a] dark:text-[#dac2b6]">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9] disabled:opacity-40 cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
