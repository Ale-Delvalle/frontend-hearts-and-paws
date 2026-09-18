'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { MascotaPerfil } from '@/types/mascotas';
import { getPerfilMascota } from '@/services/mascotaProfile';
import { useUsuarioAuth } from '@/context/UsuarioAuthContext';
import { useOngAuth } from '@/context/OngAuthContext';
import { useAuth } from '../SupabaseProvider';
import CambiarFotoMascotaModal from './CambiarFotoMascotaModal';

function formatFecha(fechaStr?: string): string {
  if (!fechaStr) return 'Fecha no especificada';
  try {
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return fechaStr;
    return fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return fechaStr;
  }
}

export default function MascotaPerfilDetalle({ id }: { id: string }) {
  const router = useRouter();
  const { usuario } = useUsuarioAuth();
  const { ong } = useOngAuth();
  const { user } = useAuth();

  const [mascota, setMascota] = useState<MascotaPerfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [fotoSeleccionada, setFotoSeleccionada] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'donacion_activa' | 'adopcion'>('todos');
  const [busquedaTimeline, setBusquedaTimeline] = useState('');
  const [compartido, setCompartido] = useState(false);
  const [modalCambiarFotoOpen, setModalCambiarFotoOpen] = useState(false);

  const esOngDuena = Boolean(
    ong && (ong.id === mascota?.organizacionId || ong.id === mascota?.organizacion?.id)
  );

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError('');
      try {
        const data = await getPerfilMascota(id);
        setMascota(data);
      } catch (err) {
        console.error('Error al cargar perfil de mascota:', err);
        setError('No se pudo encontrar la mascota solicitada.');
      } finally {
        setCargando(false);
      }
    }
    if (id) {
      cargar();
    }
  }, [id]);

  const imagenes = useMemo(() => {
    if (mascota?.imagenes && mascota.imagenes.length > 0) {
      return mascota.imagenes.map((img) => img.url);
    }
    return ['/placeholder-pet.jpg'];
  }, [mascota]);

  // Timeline: Casos activos de donación PRIMEROS, luego resto por fecha descendente
  const casosTimeline = useMemo(() => {
    const casos = mascota?.casos || [];

    let filtrados = casos.filter((caso) => {
      if (filtroTipo === 'donacion_activa') {
        return caso.tipo === 'DONACION' && caso.donacion?.estado === 'ACTIVO';
      }
      if (filtroTipo === 'adopcion') {
        return caso.tipo === 'ADOPCION';
      }
      return true;
    });

    if (busquedaTimeline.trim()) {
      const term = busquedaTimeline.toLowerCase();
      filtrados = filtrados.filter(
        (caso) =>
          caso.titulo?.toLowerCase().includes(term) ||
          caso.descripcion?.toLowerCase().includes(term)
      );
    }

    // Regla: DONACIONES ACTIVAS PRIMERAS
    return filtrados.sort((a, b) => {
      const aActiva = a.tipo === 'DONACION' && a.donacion?.estado === 'ACTIVO';
      const bActiva = b.tipo === 'DONACION' && b.donacion?.estado === 'ACTIVO';

      if (aActiva && !bActiva) return -1;
      if (!aActiva && bActiva) return 1;

      return new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime();
    });
  }, [mascota, filtroTipo, busquedaTimeline]);

  // Caso de donación activa destacado (si existe)
  const casoDonacionActiva = useMemo(() => {
    return mascota?.casos?.find(
      (c) => c.tipo === 'DONACION' && c.donacion?.estado === 'ACTIVO'
    );
  }, [mascota]);

  const handleAdoptar = () => {
    if (!usuario && !user) {
      toast.error('Necesitás iniciar sesión para postularte a la adopción.');
      router.push('/login');
      return;
    }
    router.push(`/adoptar/formulario-adopcion?id=${mascota?.id}`);
  };

  const handleCopiarEnlace = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCompartido(true);
      toast.success('¡Enlace del perfil copiado al portapapeles! 🐾');
      setTimeout(() => setCompartido(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial py-10 px-4 sm:px-6 md:px-12 selection:bg-[#c85a32] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Barra de navegación superior con botón Volver */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push('/adoptar/adopcion')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold hover:bg-[#fff1ea] dark:hover:bg-[#26262e] transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Volver a adopciones</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopiarEnlace}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold hover:bg-[#fff1ea] dark:hover:bg-[#26262e] transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-base">
                {compartido ? 'check' : 'share'}
              </span>
              <span>{compartido ? 'Enlace copiado' : 'Compartir perfil'}</span>
            </button>
          </div>
        </div>

        {/* Estado de Carga */}
        {cargando && (
          <div className="text-center py-20 bg-white dark:bg-[#1c1c21] rounded-3xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 shadow-md">
            <span className="material-symbols-outlined text-5xl text-[#c85a32] animate-spin mb-3">
              progress_activity
            </span>
            <p className="text-base text-[#54433a] dark:text-[#dac2b6] font-medium">
              Cargando perfil de la mascota...
            </p>
          </div>
        )}

        {/* Estado de Error */}
        {error && (
          <div className="text-center py-16 p-6 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-5xl text-red-600 dark:text-red-400 mb-2">
              error
            </span>
            <p className="text-base text-red-700 dark:text-red-300 font-semibold mb-4">{error}</p>
            <button
              onClick={() => router.push('/adoptar/adopcion')}
              className="px-6 py-2.5 rounded-full bg-[#c85a32] text-white text-xs font-semibold hover:bg-[#a84320] transition-all"
            >
              Regresar al listado
            </button>
          </div>
        )}

        {/* Perfil cargado exitosamente */}
        {!cargando && mascota && (
          <div className="space-y-8">
            {/* Tarjeta Principal: Galería + Ficha + ONG */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Galería de Fotos (5 columnas) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#6c2f00]/5 dark:bg-[#ffdbc9]/5 border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-sm group">
                  <Image
                    src={imagenes[fotoSeleccionada] || imagenes[0]}
                    alt={mascota.nombre}
                    fill
                    className="object-cover object-center"
                    unoptimized
                    priority
                  />
                  {esOngDuena && (
                    <button
                      type="button"
                      onClick={() => setModalCambiarFotoOpen(true)}
                      className="absolute bottom-3 right-3 bg-[#c85a32] hover:bg-[#a84320] text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 transition-all backdrop-blur-xs cursor-pointer z-10"
                      title="Cambiar foto de la mascota"
                    >
                      <span className="material-symbols-outlined text-base">photo_camera</span>
                      <span>Cambiar foto</span>
                    </button>
                  )}
                </div>

                {/* Miniaturas */}
                {imagenes.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {imagenes.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setFotoSeleccionada(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          fotoSeleccionada === idx
                            ? 'border-[#c85a32] scale-105 shadow-xs'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={url}
                          alt={`Foto ${idx + 1}`}
                          fill
                          className="object-cover object-center"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Información y Datos de la Mascota (7 columnas) */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff1ea] dark:bg-[#121214] text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-bold border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15">
                      <span className="material-symbols-outlined text-sm text-[#c85a32]">pets</span>
                      {mascota.tipo?.nombre || 'Mascota'}
                    </span>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                      {mascota.estado.replace('_', ' ')}
                    </span>
                  </div>

                  <h1 className="font-display-editorial text-3xl sm:text-5xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] tracking-tight mb-3">
                    {mascota.nombre}
                  </h1>

                  {/* Badges con Datos Clave */}
                  <div className="flex flex-wrap gap-2.5 text-xs font-semibold text-[#54433a] dark:text-[#dac2b6] mb-5">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#c85a32]">cake</span>
                      {mascota.edad} {mascota.edad === 1 ? 'año' : 'años'}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#c85a32]">calendar_today</span>
                      Ingreso: {formatFecha(mascota.creada_en)}
                    </span>
                  </div>

                  {/* Tarjeta de la ONG a cargo */}
                  {mascota.organizacion && (
                    <div className="p-4 rounded-2xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 flex items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        {mascota.organizacion.imagenPerfil ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#c85a32]/30 shrink-0">
                            <Image
                              src={mascota.organizacion.imagenPerfil}
                              alt={mascota.organizacion.nombre}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#ffeade] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/20 flex items-center justify-center font-bold text-[#6c2f00] dark:text-[#ffdbc9] shrink-0">
                            {mascota.organizacion.nombre.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-[#54433a] dark:text-[#dac2b6]">Organización responsable:</p>
                          <p className="font-semibold text-sm text-[#6c2f00] dark:text-[#ffdbc9]">
                            {mascota.organizacion.nombre}
                          </p>
                          {(mascota.organizacion.ciudad || mascota.organizacion.pais) && (
                            <p className="text-xs text-[#877369] dark:text-[#dac2b6]/70 flex items-center gap-0.5 mt-0.5">
                              <span className="material-symbols-outlined text-xs">location_on</span>
                              {[mascota.organizacion.ciudad, mascota.organizacion.pais]
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/ong/${mascota.organizacion.id}`}
                        className="text-xs font-semibold text-[#c85a32] hover:text-[#a84320] border border-[#c85a32]/30 px-3.5 py-1.5 rounded-full hover:bg-[#c85a32]/10 transition-all shrink-0"
                      >
                        Ver ONG
                      </Link>
                    </div>
                  )}

                  {/* Descripción del Caso / Historia */}
                  <div className="space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9]">
                      Descripción del caso:
                    </h2>
                    <p className="text-sm sm:text-base text-[#54433a] dark:text-[#dac2b6] leading-relaxed whitespace-pre-wrap">
                      {mascota.descripcion ||
                        'Esta mascota fue rescatada por nuestra red y se encuentra en proceso de rehabilitación y búsqueda de una familia definitiva.'}
                    </p>
                  </div>
                </div>

                {/* Acciones Principales */}
                <div className="pt-4 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAdoptar}
                    className="flex-1 bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial font-semibold py-3.5 px-6 rounded-full text-sm sm:text-base transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">pets</span>
                    <span>¡Quiero Adoptar a {mascota.nombre}!</span>
                  </button>

                  <button
                    onClick={() => router.push('/donacion')}
                    className="border-2 border-[#c85a32] text-[#c85a32] hover:bg-[#c85a32] hover:text-white dark:hover:text-white font-body-editorial font-semibold py-3.5 px-6 rounded-full text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 bg-white dark:bg-[#1c1c21]"
                  >
                    <span className="material-symbols-outlined text-lg">favorite</span>
                    <span>{casoDonacionActiva ? 'Donar a este caso' : 'Colaborar con donación'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Módulo Especial: Caso de Donación Activo (si existe) */}
            {casoDonacionActiva?.donacion && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#fff1ea] to-[#ffeade] dark:from-[#1c1c21] dark:to-[#1c1c21] border-2 border-[#c85a32]/30 dark:border-[#c85a32]/40 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-2xl text-[#c85a32]">
                      volunteer_activism
                    </span>
                    <h2 className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
                      Campaña Activa de Donación: {casoDonacionActiva.titulo}
                    </h2>
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c85a32] text-white">
                    Caso Prioritario
                  </span>
                </div>

                <p className="text-sm text-[#54433a] dark:text-[#dac2b6] mb-5 leading-relaxed">
                  {casoDonacionActiva.descripcion}
                </p>

                {/* Barra de Progreso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
                    <span>
                      Recaudado: ${casoDonacionActiva.donacion.estadoDonacion.toLocaleString()}
                    </span>
                    <span>
                      Meta: ${casoDonacionActiva.donacion.metaDonacion.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-[#6c2f00]/10 dark:bg-[#ffdbc9]/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#c85a32] to-[#81c784] transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (casoDonacionActiva.donacion.estadoDonacion /
                            casoDonacionActiva.donacion.metaDonacion) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-1 text-xs">
                    <span className="text-[#877369] dark:text-[#dac2b6]/70">
                      {Math.round(
                        (casoDonacionActiva.donacion.estadoDonacion /
                          casoDonacionActiva.donacion.metaDonacion) *
                          100
                      )}
                      % de la meta alcanzada
                    </span>
                    <Link
                      href="/donacion"
                      className="text-[#c85a32] font-semibold hover:underline flex items-center gap-1"
                    >
                      Realizar donación
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline y Registro de Actividad */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/20 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/15">
                <div>
                  <h2 className="font-display-editorial text-2xl sm:text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] flex items-center gap-2">
                    <span className="material-symbols-outlined text-2xl text-[#c85a32]">
                      timeline
                    </span>
                    Línea de Tiempo y Actividad del Perfil
                  </h2>
                  <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] mt-0.5">
                    Historial cronológico de casos, donaciones y avances de {mascota.nombre}.
                  </p>
                </div>

                {/* Filtros de Búsqueda del Timeline */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={busquedaTimeline}
                      onChange={(e) => setBusquedaTimeline(e.target.value)}
                      placeholder="Buscar en timeline..."
                      className="pl-8 pr-3 py-2 text-xs rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#26262e] text-[#1c1c21] dark:text-[#ffede4] placeholder-[#877369] focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-xs text-[#877369]">
                      search
                    </span>
                  </div>

                  <div className="flex items-center bg-[#fff8f5] dark:bg-[#26262e] p-1 rounded-full border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-xs font-semibold">
                    <button
                      onClick={() => setFiltroTipo('todos')}
                      className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                        filtroTipo === 'todos'
                          ? 'bg-[#c85a32] text-white shadow-xs'
                          : 'text-[#54433a] dark:text-[#dac2b6] hover:text-[#6c2f00]'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFiltroTipo('donacion_activa')}
                      className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                        filtroTipo === 'donacion_activa'
                          ? 'bg-[#c85a32] text-white shadow-xs'
                          : 'text-[#54433a] dark:text-[#dac2b6] hover:text-[#6c2f00]'
                      }`}
                    >
                      Donaciones
                    </button>
                    <button
                      onClick={() => setFiltroTipo('adopcion')}
                      className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                        filtroTipo === 'adopcion'
                          ? 'bg-[#c85a32] text-white shadow-xs'
                          : 'text-[#54433a] dark:text-[#dac2b6] hover:text-[#6c2f00]'
                      }`}
                    >
                      Adopción
                    </button>
                  </div>
                </div>
              </div>

              {/* Eventos en Línea de Tiempo */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#6c2f00]/15 dark:before:bg-[#ffdbc9]/20">
                {casosTimeline.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 text-center text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6]">
                    No se encontraron eventos en el timeline con los filtros seleccionados.
                  </div>
                ) : (
                  casosTimeline.map((caso) => {
                    const esDonacion = caso.tipo === 'DONACION';
                    const esActiva = esDonacion && caso.donacion?.estado === 'ACTIVO';

                    return (
                      <div key={caso.id} className="relative group">
                        {/* Nodo en el Timeline */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                            esActiva
                              ? 'bg-[#c85a32] border-[#fff8f5] dark:border-[#1c1c21] text-white shadow-xs'
                              : esDonacion
                              ? 'bg-amber-600 border-[#fff8f5] dark:border-[#1c1c21] text-white'
                              : 'bg-emerald-600 border-[#fff8f5] dark:border-[#1c1c21] text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[11px]">
                            {esActiva ? 'volunteer_activism' : esDonacion ? 'savings' : 'pets'}
                          </span>
                        </div>

                        {/* Tarjeta del Evento */}
                        <div
                          className={`p-5 rounded-2xl border transition-all ${
                            esActiva
                              ? 'bg-[#fff8f5] dark:bg-[#1c1c21] border-[#c85a32]/50 shadow-xs'
                              : 'bg-[#fff8f5] dark:bg-[#26262e] border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 hover:border-[#6c2f00]/25'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  esActiva
                                    ? 'bg-[#c85a32] text-white'
                                    : esDonacion
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                }`}
                              >
                                {esActiva
                                  ? 'Donación Activa'
                                  : esDonacion
                                  ? 'Donación'
                                  : 'Adopción'}
                              </span>
                              <span className="text-xs text-[#877369] dark:text-[#dac2b6]/70">
                                {formatFecha(caso.creado_en)}
                              </span>
                            </div>

                            {esActiva && (
                              <span className="text-xs font-bold text-[#c85a32] flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">emergency</span>
                                En curso
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-base text-[#6c2f00] dark:text-[#ffdbc9] mb-1.5">
                            {caso.titulo}
                          </h3>

                          <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
                            {caso.descripcion}
                          </p>

                          {esDonacion && caso.donacion && (
                            <div className="mt-3 pt-3 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 flex items-center justify-between text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9]">
                              <span>
                                Recaudado: ${caso.donacion.estadoDonacion.toLocaleString()} / $
                                {caso.donacion.metaDonacion.toLocaleString()}
                              </span>
                              {esActiva && (
                                <Link
                                  href="/donacion"
                                  className="text-[#c85a32] hover:underline flex items-center gap-0.5"
                                >
                                  Ir a donar
                                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
        {/* Modal para cambiar foto de la mascota */}
        {mascota && (
          <CambiarFotoMascotaModal
            isOpen={modalCambiarFotoOpen}
            onClose={() => setModalCambiarFotoOpen(false)}
            mascotaId={mascota.id}
            nombreMascota={mascota.nombre}
            fotoActualUrl={imagenes[0]}
            onFotoActualizada={(nuevaUrl) => {
              setMascota((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  imagenes: [
                    { id: 'nueva', url: nuevaUrl, urlBlur: null, esSensible: false },
                    ...(prev.imagenes || []),
                  ],
                };
              });
              setFotoSeleccionada(0);
            }}
          />
        )}
      </div>
    </div>
  );
}
