'use client'

import { useState, useEffect, useCallback } from 'react'

import MascotaCard from './MascotaCard'
import { Caso } from '@/types/casos'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { getMascotasEnAdopcion, getMascotasFiltradas } from '@/services/mascotas'
import { obtenerMisSolicitudesResumen } from '@/services/adopcion'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { useAuth } from '@/components/SupabaseProvider'

export default function AdopcionPage() {
  const router = useRouter()
  const { usuario } = useUsuarioAuth()
  const { user, token } = useAuth()
  const [mascotasSolicitadas, setMascotasSolicitadas] = useState<Set<string>>(new Set())

  // Una sola consulta: marca en el catálogo las mascotas ya solicitadas por el usuario
  useEffect(() => {
    if (!usuario && !user) return
    let activo = true
    obtenerMisSolicitudesResumen(token ?? undefined)
      .then((resumen) => {
        if (activo) setMascotasSolicitadas(new Set(resumen.map((r) => r.mascotaId)))
      })
      .catch(() => {
        /* si falla, el catálogo sigue funcionando sin el aviso */
      })
    return () => {
      activo = false
    }
  }, [usuario, user, token])

  // Ahora tipo puede ser '', 'perro' o 'gato'
  const [tipo, setTipo] = useState<'perro' | 'gato' | ''>('')
  const [resultados, setResultados] = useState<Caso[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [orden, setOrden] = useState<'mas_reciente' | 'mas_antiguo'>('mas_reciente')

  const fetchMascotas = useCallback(async (filtros: { tipo?: string }) => {
    setCargando(true)
    setError('')
    try {
      const data =
        Object.keys(filtros).length === 0
          ? await getMascotasEnAdopcion()
          : await getMascotasFiltradas(filtros)

      setResultados(data)
    } catch {
      setError('Hubo un error al cargar las mascotas.')
      setResultados([])
    } finally {
      setCargando(false)
    }
  }, [])

  // Traer mascotas cuando cambien tipo o al inicio (tipo inicial '')
  useEffect(() => {
    fetchMascotas(tipo ? { tipo } : {})
  }, [tipo, fetchMascotas])

  const resultadosOrdenados = resultados.slice().sort((a, b) => {
    // Las mascotas ya solicitadas por el usuario van siempre al final
    const solicitadaA = mascotasSolicitadas.has(a.mascota.id) ? 1 : 0
    const solicitadaB = mascotasSolicitadas.has(b.mascota.id) ? 1 : 0
    if (solicitadaA !== solicitadaB) return solicitadaA - solicitadaB

    const fechaA = new Date(a.creado_en).getTime()
    const fechaB = new Date(b.creado_en).getTime()
    if (orden === 'mas_reciente') {
      return fechaB - fechaA
    } else {
      return fechaA - fechaB
    }
  })

  const handleAdoptar = (id: string) => {
    const caso = resultados.find(c => c.mascota.id === id)
    if (!caso) return
    if (mascotasSolicitadas.has(id)) {
      toast('Ya solicitaste la adopción de esta mascota.')
      return
    }

    toast.success(`¡Gracias por querer adoptar a ${caso.mascota.nombre}! 🐶🐱`)
    router.push(`/adoptar/formulario-adopcion?id=${caso.mascota.id}`)
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial flex flex-col selection:bg-[#c85a32] selection:text-white">


      {/* 2. Main Content */}
      <main className="flex-grow py-16 px-6 md:px-12 max-w-[1280px] mx-auto w-full">
        {/* Titulación Hero Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#6c2f00] dark:text-[#ffdbc9] font-bold mb-6 tracking-tight leading-[1.1]">
            Nuestros Amigos Esperan
          </h1>
          <p className="font-body-editorial text-base sm:text-lg md:text-xl text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
            Cada uno de estos animales tiene una historia única y está listo para comenzar un nuevo capítulo. Encuentra a tu compañero ideal.
          </p>
        </div>

        {/* 3. Filtros de Búsqueda Integrados */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-14">
          {/* Filtro por Tipo */}
          <div className="relative w-full sm:w-1/2">
            <select
              className="appearance-none w-full px-5 py-3 pr-10 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] dark:focus:ring-[#c85a32] transition-all cursor-pointer"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'perro' | 'gato' | '')}
              aria-label="Filtrar por tipo de mascota"
            >
              <option value="" className="bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9]">Todos los animales</option>
              <option value="perro" className="bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9]">Perros</option>
              <option value="gato" className="bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9]">Gatos</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6c2f00] dark:text-[#ffdbc9]">
              <span className="material-symbols-outlined text-xl">expand_more</span>
            </div>
          </div>

          {/* Filtro por Orden */}
          <div className="relative w-full sm:w-1/2">
            <select
              className="appearance-none w-full px-5 py-3 pr-10 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] dark:focus:ring-[#c85a32] transition-all cursor-pointer"
              value={orden}
              onChange={(e) => setOrden(e.target.value as 'mas_reciente' | 'mas_antiguo')}
              aria-label="Ordenar mascotas"
            >
              <option value="mas_reciente" className="bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9]">Más reciente</option>
              <option value="mas_antiguo" className="bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9]">Más antiguo</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6c2f00] dark:text-[#ffdbc9]">
              <span className="material-symbols-outlined text-xl">swap_vert</span>
            </div>
          </div>
        </div>

        {/* Estados de Carga y Error */}
        {cargando && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-[#6c2f00] dark:text-[#ffdbc9] animate-spin mb-2">progress_activity</span>
            <p className="font-body-editorial text-base text-[#54433a] dark:text-[#dac2b6]">Cargando compañeros en adopción...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 max-w-md mx-auto">
            <p className="font-body-editorial text-sm text-red-600 dark:text-red-300 font-semibold">{error}</p>
          </div>
        )}

        {!cargando && resultados.length === 0 && (
          <div className="text-center py-16 bg-[#fff1ea] dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15">
            <span className="material-symbols-outlined text-5xl text-[#6c2f00]/40 dark:text-[#ffdbc9]/40 mb-3">pets</span>
            <p className="font-body-editorial text-lg text-[#54433a] dark:text-[#dac2b6] font-medium">No se encontraron mascotas con el filtro seleccionado.</p>
          </div>
        )}

        {/* 4. Grilla de Tarjetas de Mascotas */}
        {!cargando && resultados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resultadosOrdenados.map((caso) => {
              const mascota = {
                ...caso.mascota,
                casoId: caso.id,
                tipo: caso.tipo.toLowerCase(),
                descripcion: caso.descripcion,
                ongNombre: caso.ong?.nombre,
              }

              return (
                <MascotaCard
                  key={caso.id}
                  mascota={mascota}
                  onVerPerfil={() => router.push(`/user/mascota/${mascota.id}`)}
                  onConocerHistoria={() => router.push(`/user/mascota/${mascota.id}`)}
                  onAdoptar={() => handleAdoptar(mascota.id)}
                  modo="adopcion"
                  yaSolicitada={mascotasSolicitadas.has(mascota.id)}
                />
              )
            })}
          </div>
        )}
      </main>

      {/* 5. Footer Editorial (Idéntico a la referencia) */}
      <footer className="bg-[#fbddca] dark:bg-[#0d0d0f] w-full py-12 px-6 md:px-12 border-t border-[#dac2b6]/40 dark:border-[#ffdbc9]/15 mt-auto text-[#1c1c21] dark:text-[#ffede4]">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto gap-8">
          <div className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#ffdbc9]">pets</span>
            Hearts&amp;Paws
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-body-editorial text-sm font-semibold text-[#54433a] dark:text-[#dac2b6]">
            <a href="#" className="hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-colors">Términos</a>
            <a href="#" className="hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-colors">Contacto</a>
            <a href="#" className="hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-colors">Voluntariado</a>
          </nav>
          <div className="font-body-editorial text-sm text-[#6c2f00] dark:text-[#ffdbc9] text-center md:text-right font-medium">
            © 2024 Hearts&amp;Paws. Cada huella cuenta una historia.
          </div>
        </div>
      </footer>
    </div>
  )
}

