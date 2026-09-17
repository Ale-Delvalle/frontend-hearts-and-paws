'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CasoCerradoItem, MotivoCierreCaso } from '@/types/casos'
import { getCasosCerradosOng } from '@/services/ongProfile'

const LIMITE_POR_PAGINA = 10

interface OngCasosCerradosProps {
  ongId: string
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function obtenerDetalleCierre(caso: CasoCerradoItem) {
  if (caso.mascota.estado === 'FALLECIDO') {
    return {
      etiqueta: 'En memoria',
      subtitulo: 'Animal recordado con cariño',
      icono: 'sentiment_very_satisfied',
      claseBadge: 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-900/60 dark:text-stone-300 dark:border-stone-700',
    }
  }

  if (caso.mascota.estado === 'ADOPTADO' || caso.adopcion?.estado === 'ACEPTADA') {
    return {
      etiqueta: 'Adopción completada',
      subtitulo: '¡Encontró un hogar definitivo!',
      icono: 'home',
      claseBadge: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800',
    }
  }

  if (
    caso.tipo === 'DONACION' &&
    (caso.donacion?.estado === 'COMPLETADO' ||
      (caso.donacion && caso.donacion.estadoDonacion >= caso.donacion.metaDonacion))
  ) {
    return {
      etiqueta: 'Meta de donación alcanzada',
      subtitulo: 'Objetivo económico cumplido con éxito',
      icono: 'favorite',
      claseBadge: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800',
    }
  }

  return {
    etiqueta: 'Caso resuelto',
    subtitulo: 'Finalizado satisfactoriamente',
    icono: 'check_circle',
    claseBadge: 'bg-[#fff1ea] text-[#6c2f00] border-[#c85a32]/30 dark:bg-[#26262e] dark:text-[#ffdbc9] dark:border-[#c85a32]/40',
  }
}

export default function OngCasosCerrados({ ongId }: OngCasosCerradosProps) {
  const [casos, setCasos] = useState<CasoCerradoItem[]>([])
  const [filtroMotivo, setFiltroMotivo] = useState<MotivoCierreCaso | ''>('')
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState('')

  const cargarPagina = useCallback(
    async (paginaActual: number, reemplazar: boolean, motivo?: string) => {
      const data = await getCasosCerradosOng(ongId, paginaActual, LIMITE_POR_PAGINA, motivo || undefined)
      setCasos((prev) => (reemplazar ? data.data : [...prev, ...data.data]))
      setTotal(data.total)
    },
    [ongId],
  )

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError('')
    setPagina(1)

    cargarPagina(1, true, filtroMotivo)
      .catch(() => {
        if (!cancelado) setError('No se pudieron cargar los casos cerrados de esta organización.')
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [cargarPagina, filtroMotivo])

  const handleCargarMas = async () => {
    setCargandoMas(true)
    try {
      const siguiente = pagina + 1
      await cargarPagina(siguiente, false, filtroMotivo)
      setPagina(siguiente)
    } catch {
      setError('No se pudieron cargar más casos.')
    } finally {
      setCargandoMas(false)
    }
  }

  const filtros = [
    { label: 'Todos', valor: '' },
    { label: '🎉 Adopción completada', valor: 'ADOPCION' },
    { label: '💚 Meta alcanzada', valor: 'DONACION' },
    { label: '🕊️ En memoria', valor: 'FALLECIDO' },
  ]

  const hayMas = casos.length < total

  return (
    <div className="flex flex-col gap-6 font-body-editorial">
      {/* Encabezado y Contador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#6c2f00]/10 dark:border-[#c85a32]/20">
        <div>
          <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
            Casos resueltos y cerrados
          </h2>
          <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] mt-0.5">
            Historias concluidas: metas superadas, adopciones felices y animales recordados con amor.
          </p>
        </div>

        {total > 0 && (
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c85a32] bg-[#fff1ea] dark:bg-[#26262e] px-3.5 py-1.5 rounded-full border border-[#6c2f00]/15 dark:border-[#c85a32]/30 shrink-0 self-start sm:self-auto">
            {total} {total === 1 ? 'caso cerrado' : 'casos cerrados'}
          </span>
        )}
      </div>

      {/* Selector de Filtros por Motivo */}
      <div className="flex flex-wrap gap-2">
        {filtros.map((item) => {
          const activo = filtroMotivo === item.valor
          return (
            <button
              key={item.valor}
              onClick={() => setFiltroMotivo(item.valor as MotivoCierreCaso | '')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activo
                  ? 'bg-[#c85a32] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/15 dark:border-[#c85a32]/25 hover:bg-[#ffeade] dark:hover:bg-[#26262e]'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Skeleton de Carga */}
      {cargando && (
        <div className="flex flex-col gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-4 flex flex-col sm:flex-row gap-4 shadow-xs"
            >
              <div className="w-full sm:w-56 h-36 sm:h-full bg-[#fff1ea] dark:bg-[#26262e] rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col justify-between py-1 gap-2">
                <div className="space-y-2.5">
                  <div className="h-5 w-32 bg-[#fff1ea] dark:bg-[#26262e] rounded-full" />
                  <div className="h-6 w-3/4 bg-[#fff1ea] dark:bg-[#26262e] rounded-lg" />
                  <div className="h-3.5 w-full bg-[#fff1ea] dark:bg-[#26262e] rounded" />
                  <div className="h-3.5 w-4/5 bg-[#fff1ea] dark:bg-[#26262e] rounded" />
                </div>
                <div className="h-4 w-28 bg-[#fff1ea] dark:bg-[#26262e] rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-red-600 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Estado Vacío */}
      {!cargando && !error && casos.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#1c1c21] rounded-3xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-8 shadow-xs">
          <span className="material-symbols-outlined text-5xl text-[#c85a32]/60 mb-3 block">
            verified
          </span>
          <h3 className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1">
            No se encontraron casos resueltos
          </h3>
          <p className="text-sm text-[#54433a] dark:text-[#dac2b6] max-w-md mx-auto">
            {filtroMotivo
              ? 'No hay casos cerrados bajo el filtro seleccionado en este momento.'
              : 'Esta organización aún no tiene casos concluidos en su historial.'}
          </p>
        </div>
      )}

      {/* Lista de Casos Resueltos */}
      {!cargando && !error && casos.length > 0 && (
        <div className="flex flex-col gap-5">
          {casos.map((caso) => {
            const detalle = obtenerDetalleCierre(caso)
            const imagenUrl = caso.mascota.imagenes?.[0]?.url || 'https://via.placeholder.com/400x300?text=Mascota'

            return (
              <article
                key={caso.id}
                className="group bg-white dark:bg-[#1c1c21] rounded-2xl shadow-xs hover:shadow-md border border-[#6c2f00]/15 dark:border-[#c85a32]/25 overflow-hidden flex flex-col sm:flex-row transition-all duration-200"
              >
                {/* Imagen de la Mascota */}
                <Link
                  href={`/mascotas/${caso.mascota.id}`}
                  className="relative w-full sm:w-60 h-48 sm:h-auto min-h-[12rem] shrink-0 bg-[#fff5f2] dark:bg-[#26262e] overflow-hidden block"
                >
                  <Image
                    src={imagenUrl}
                    alt={caso.mascota.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 240px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent sm:hidden" />
                </Link>

                {/* Contenido Editorial */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-3">
                  <div className="space-y-2.5">
                    {/* Header: Badge de Resolución + Fecha */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${detalle.claseBadge}`}
                      >
                        <span className="material-symbols-outlined text-sm">{detalle.icono}</span>
                        <span>{detalle.etiqueta}</span>
                      </span>

                      <span className="text-xs text-[#54433a]/70 dark:text-[#dac2b6]/70">
                        {formatearFecha(caso.creado_en)}
                      </span>
                    </div>

                    {/* Título y Descripción */}
                    <div>
                      <h3 className="font-display-editorial text-lg sm:text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] group-hover:text-[#c85a32] dark:group-hover:text-[#c85a32] transition-colors line-clamp-2">
                        {caso.titulo}
                      </h3>
                      <p className="text-sm text-[#54433a] dark:text-[#dac2b6] line-clamp-2 leading-relaxed mt-1">
                        {caso.descripcion}
                      </p>
                    </div>

                    {/* Progreso de Donación si aplica */}
                    {caso.tipo === 'DONACION' && caso.donacion && (
                      <div className="bg-[#fff8f5] dark:bg-[#121214] p-2.5 rounded-xl border border-[#6c2f00]/10 dark:border-[#c85a32]/20 text-xs flex justify-between items-center text-[#54433a] dark:text-[#dac2b6] font-semibold">
                        <span>Recaudado: ${caso.donacion.estadoDonacion.toLocaleString('es-AR')}</span>
                        <span className="text-[#2e5d32] dark:text-[#4caf50] flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          Meta alcanzada (${caso.donacion.metaDonacion.toLocaleString('es-AR')})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer de Tarjeta con Enlace al Perfil */}
                  <div className="pt-2 border-t border-[#6c2f00]/10 dark:border-[#c85a32]/15 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#54433a]/70 dark:text-[#dac2b6]/70 italic">
                      {detalle.subtitulo}
                    </span>

                    <Link
                      href={`/mascotas/${caso.mascota.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c85a32] hover:text-[#a84320] dark:text-[#c85a32] dark:hover:text-[#ffdbc9] transition-all hover:underline"
                    >
                      <span>Ver perfil de {caso.mascota.nombre}</span>
                      <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}

          {/* Botón Cargar Más */}
          {hayMas && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleCargarMas}
                disabled={cargandoMas}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/20 dark:border-[#c85a32]/30 hover:bg-[#ffeade] dark:hover:bg-[#26262e] transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {cargandoMas ? 'Cargando más...' : 'Cargar más casos'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
