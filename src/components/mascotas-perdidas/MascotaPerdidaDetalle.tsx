'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MascotaPerdida, EstadoPerdida } from '@/types/mascotaPerdida';
import {
  getMascotaPerdidaById,
  actualizarEstadoMascotaPerdida,
  eliminarMascotaPerdida,
} from '@/services/mascotasPerdidasService';

// ─── helpers ──────────────────────────────────────────────────────────────────
function getBadgeEstado(estado: EstadoPerdida) {
  switch (estado) {
    case 'REUNIDO':
      return {
        label: '¡Reunido con su familia! 🎉',
        className:
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        icon: 'favorite',
      };
    case 'ENCONTRADO':
      return {
        label: 'Encontrado / Buscando dueño',
        className:
          'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        icon: 'search',
      };
    case 'PERDIDO':
    default:
      return {
        label: 'Extraviado / Perdido',
        className:
          'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-700',
        icon: 'help',
      };
  }
}

function formatFecha(fechaStr: string): string {
  try {
    const f = new Date(fechaStr);
    if (!isNaN(f.getTime())) {
      return f.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  } catch {
    /* noop */
  }
  return fechaStr;
}

// ─── skeleton ─────────────────────────────────────────────────────────────────
function SkeletonDetalle() {
  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] py-10 px-4 sm:px-8 lg:px-16 font-body-editorial animate-pulse">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="h-5 w-32 bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full aspect-square bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-full" />
            <div className="h-4 w-full bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-full" />
            <div className="h-4 w-5/6 bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-full" />
            <div className="h-4 w-2/3 bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── modal de confirmación ────────────────────────────────────────────────────
interface ConfirmModalProps {
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  cargando?: boolean;
}

function ConfirmModal({ mensaje, onConfirmar, onCancelar, cargando }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1c1c21] rounded-3xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-2xl p-8 max-w-sm w-full text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400">warning</span>
        </div>
        <p className="text-[#1c1c21] dark:text-[#ffede4] font-semibold text-sm leading-relaxed">{mensaje}</p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="px-5 py-2.5 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >
            {cargando && (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
interface MascotaPerdidaDetalleProps {
  id: string;
}

export default function MascotaPerdidaDetalle({ id }: MascotaPerdidaDetalleProps) {
  const router = useRouter();

  const [publicacion, setPublicacion] = useState<MascotaPerdida | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false);
  const [mostrarSelectorEstado, setMostrarSelectorEstado] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const data = await getMascotaPerdidaById(id);
      setPublicacion(data);
    } catch {
      setError('No pudimos encontrar esta publicación. Puede haber sido eliminada o el enlace es incorrecto.');
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleCambioEstado = async (nuevoEstado: EstadoPerdida) => {
    if (!publicacion) return;
    setActualizandoEstado(true);
    setMostrarSelectorEstado(false);
    try {
      const res = await actualizarEstadoMascotaPerdida(publicacion.id, nuevoEstado);
      setPublicacion(res.publicacion);
      setFeedbackMsg('Estado actualizado correctamente.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar el estado.';
      setFeedbackMsg(msg);
    } finally {
      setActualizandoEstado(false);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleEliminar = async () => {
    if (!publicacion) return;
    setEliminando(true);
    try {
      await eliminarMascotaPerdida(publicacion.id);
      setMostrarConfirmEliminar(false);
      router.push('/mascotas-perdidas');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la publicación.';
      setFeedbackMsg(msg);
      setMostrarConfirmEliminar(false);
      setEliminando(false);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  if (cargando) return <SkeletonDetalle />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] flex flex-col items-center justify-center px-6 text-center space-y-6 font-body-editorial">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-red-500">sentiment_dissatisfied</span>
        </div>
        <h2 className="font-display-editorial text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
          Publicación no encontrada
        </h2>
        <p className="text-sm text-[#54433a] dark:text-[#dac2b6] max-w-md leading-relaxed">{error}</p>
        <Link
          href="/mascotas-perdidas"
          className="inline-flex items-center gap-2 bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold text-sm px-6 py-3.5 rounded-full shadow-md transition"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver al listado
        </Link>
      </div>
    );
  }

  if (!publicacion) return null;

  const badge = getBadgeEstado(publicacion.estado);
  const autorNombre =
    publicacion.organizacion?.nombre || publicacion.usuario?.nombre || 'Comunidad Hearts&Paws';
  const esOng = Boolean(publicacion.organizacion);
  const autorTelefono = publicacion.organizacion
    ? (publicacion.organizacion as AutorConTelefono).telefono
    : publicacion.usuario?.telefono;

  const ESTADOS_OPCIONES: { value: EstadoPerdida; label: string; icon: string }[] = [
    { value: 'PERDIDO', label: 'Extraviado / Perdido', icon: 'help' },
    { value: 'ENCONTRADO', label: 'Encontrado / Buscando dueño', icon: 'search' },
    { value: 'REUNIDO', label: '¡Reunido con su familia!', icon: 'favorite' },
  ];

  return (
    <>
      {mostrarConfirmEliminar && (
        <ConfirmModal
          mensaje="¿Estás seguro de que querés eliminar esta publicación? Esta acción no se puede deshacer."
          onConfirmar={handleEliminar}
          onCancelar={() => setMostrarConfirmEliminar(false)}
          cargando={eliminando}
        />
      )}

      <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial transition-colors">
        <div className="max-w-5xl mx-auto py-10 px-4 sm:px-8 lg:px-12 space-y-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#54433a] dark:text-[#dac2b6]">
            <Link href="/" className="hover:text-[#c85a32] transition">Inicio</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <Link href="/mascotas-perdidas" className="hover:text-[#c85a32] transition">Mascotas Perdidas</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#6c2f00] dark:text-[#ffdbc9] font-semibold truncate max-w-[180px]">
              {publicacion.nombre}
            </span>
          </nav>

          {feedbackMsg && (
            <div className="px-5 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              {feedbackMsg}
            </div>
          )}

          {publicacion.moderacion !== 'APROBADA' && (
            <div
              className={`px-5 py-3.5 rounded-2xl border text-sm font-semibold flex items-center gap-2 ${
                publicacion.moderacion === 'RECHAZADA'
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {publicacion.moderacion === 'RECHAZADA' ? 'block' : 'hourglass_top'}
              </span>
              {publicacion.moderacion === 'RECHAZADA'
                ? 'Esta publicación fue rechazada por un administrador y no es visible para el público.'
                : 'Esta publicación está pendiente de aprobación y aún no es visible para el público.'}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Columna imagen */}
            <div className="lg:col-span-3 space-y-4">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#fff1ea] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-sm">
                {publicacion.imagenUrl ? (
                  <Image
                    src={publicacion.imagenUrl}
                    alt={publicacion.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#54433a]/50 dark:text-[#dac2b6]/50">
                    <span className="material-symbols-outlined text-6xl text-[#c85a32]/50">pets</span>
                    <span className="text-xs font-semibold">Sin foto disponible</span>
                  </div>
                )}

                <span
                  className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full border shadow backdrop-blur-sm flex items-center gap-1.5 ${badge.className}`}
                >
                  <span className="material-symbols-outlined text-sm">{badge.icon}</span>
                  {badge.label}
                </span>

                {publicacion.recompensa && (
                  <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-950 font-bold text-[11px] px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">monetization_on</span>
                    Recompensa
                  </span>
                )}
              </div>

              {publicacion.recompensa && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                  <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5">monetization_on</span>
                  <div>
                    <p className="text-xs font-bold text-yellow-800 dark:text-yellow-300">Recompensa ofrecida</p>
                    <p className="text-sm text-yellow-900 dark:text-yellow-200 leading-relaxed mt-0.5">
                      {publicacion.recompensa}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Columna información */}
            <div className="lg:col-span-2 space-y-6">

              <div>
                <h1 className="font-display-editorial text-4xl sm:text-5xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] leading-tight">
                  {publicacion.nombre}
                </h1>
                <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-[#fff1ea] dark:bg-[#1c1c21] text-[#c85a32] dark:text-[#ffdbc9] text-sm font-semibold border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15">
                  {publicacion.tipo}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 shadow-sm">
                <p className="text-xs font-bold text-[#c85a32] uppercase tracking-widest mb-2">Descripción</p>
                <p className="text-sm text-[#54433a] dark:text-[#dac2b6] leading-relaxed whitespace-pre-wrap">
                  {publicacion.descripcion}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 shadow-sm space-y-3.5">
                <p className="text-xs font-bold text-[#c85a32] uppercase tracking-widest">Detalles</p>

                <div className="flex items-start gap-2.5 text-sm text-[#54433a] dark:text-[#dac2b6]">
                  <span className="material-symbols-outlined text-base text-[#c85a32] shrink-0 mt-0.5">location_on</span>
                  <div>
                    <span className="font-semibold">{publicacion.ubicacion}</span>
                    {publicacion.ciudad && <span className="text-xs"> · {publicacion.ciudad}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-sm text-[#54433a] dark:text-[#dac2b6]">
                  <span className="material-symbols-outlined text-base text-[#c85a32] shrink-0">calendar_today</span>
                  <span>Visto el {formatFecha(publicacion.fechaPerdido)}</span>
                </div>

                <div className="flex items-center gap-2.5 text-sm text-[#54433a] dark:text-[#dac2b6]">
                  <span className="material-symbols-outlined text-base text-[#c85a32] shrink-0">schedule</span>
                  <span>Publicado el {formatFecha(publicacion.creado_en)}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 shadow-sm space-y-3.5">
                <p className="text-xs font-bold text-[#c85a32] uppercase tracking-widest">Contacto</p>

                <div className="flex items-center gap-2.5 text-sm text-[#54433a] dark:text-[#dac2b6]">
                  <span className="material-symbols-outlined text-base text-[#c85a32] shrink-0">
                    {esOng ? 'corporate_fare' : 'person'}
                  </span>
                  <span>
                    <span className="font-semibold">{esOng ? 'ONG:' : 'Por:'}</span> {autorNombre}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-sm text-[#54433a] dark:text-[#dac2b6]">
                  <span className="material-symbols-outlined text-base text-[#c85a32] shrink-0 mt-0.5">contact_phone</span>
                  <span className="break-words">{publicacion.contacto}</span>
                </div>

                {autorTelefono && autorTelefono !== publicacion.contacto && (
                  <div className="flex items-center gap-2.5 text-sm text-[#54433a] dark:text-[#dac2b6]">
                    <span className="material-symbols-outlined text-base text-[#c85a32] shrink-0">phone</span>
                    <span>{autorTelefono}</span>
                  </div>
                )}

                <a
                  href={`https://wa.me/${publicacion.contacto.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Vi la publicación de "${publicacion.nombre}" en Hearts&Paws y quiero ayudar.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-semibold text-sm py-3.5 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contactar por WhatsApp
                </a>
              </div>

              {/* Gestionar publicación */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 shadow-sm space-y-3">
                <p className="text-xs font-bold text-[#c85a32] uppercase tracking-widest">Gestionar publicación</p>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMostrarSelectorEstado((prev) => !prev)}
                    disabled={actualizandoEstado}
                    className="w-full inline-flex items-center justify-between gap-2 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold px-4 py-3 rounded-xl hover:bg-[#fff1ea] dark:hover:bg-[#26262e] transition disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#c85a32]">edit_note</span>
                      {actualizandoEstado ? 'Actualizando…' : 'Cambiar estado'}
                    </span>
                    <span className="material-symbols-outlined text-base">
                      {mostrarSelectorEstado ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {mostrarSelectorEstado && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-xl overflow-hidden">
                      {ESTADOS_OPCIONES.map((op) => (
                        <button
                          key={op.value}
                          type="button"
                          onClick={() => handleCambioEstado(op.value)}
                          disabled={publicacion.estado === op.value}
                          className={`w-full flex items-center gap-2.5 px-4 py-3.5 text-xs font-semibold transition hover:bg-[#fff1ea] dark:hover:bg-[#26262e] text-left ${
                            publicacion.estado === op.value
                              ? 'opacity-40 cursor-not-allowed'
                              : 'text-[#54433a] dark:text-[#dac2b6]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base text-[#c85a32]">{op.icon}</span>
                          {op.label}
                          {publicacion.estado === op.value && (
                            <span className="ml-auto text-[10px] text-[#c85a32] font-bold uppercase tracking-wider">
                              Actual
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setMostrarConfirmEliminar(true)}
                  className="w-full inline-flex items-center justify-center gap-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-semibold px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Eliminar publicación
                </button>
              </div>

              <Link
                href="/mascotas-perdidas"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#54433a] dark:text-[#dac2b6] hover:text-[#c85a32] dark:hover:text-[#c85a32] transition"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Volver al listado
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Tipo auxiliar para evitar casting repetido
interface AutorConTelefono {
  id: string;
  nombre: string;
  email: string;
  telefono?: string | null;
}
