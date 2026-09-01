'use client'

import { useState, useEffect, useCallback } from 'react'

import MascotaCard from './MascotaCard'
import MascotaModal from './MascotaModal'
import { Mascota } from '@/types/mascotas'
import { Caso } from '@/types/casos'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { getMascotasEnAdopcion, getMascotasFiltradas } from '@/services/mascotas'

export default function AdopcionPage() {
  const router = useRouter()

  // Estado para el tema claro forzado de esta vista editorial
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    document.documentElement.dataset.theme = 'light'
  }, [])

  // Ahora tipo puede ser '', 'perro' o 'gato'
  const [tipo, setTipo] = useState<'perro' | 'gato' | ''>('')
  const [resultados, setResultados] = useState<Caso[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null)
  const [mostrandoHistoria, setMostrandoHistoria] = useState(false)
  const [cargandoHistoria] = useState(false)
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
    const fechaA = new Date(a.creado_en).getTime()
    const fechaB = new Date(b.creado_en).getTime()
    if (orden === 'mas_reciente') {
      return fechaB - fechaA
    } else {
      return fechaA - fechaB
    }
  })

  const handleConocerHistoria = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota)
    setMostrandoHistoria(true)
  }

  const handleAdoptar = (id: string) => {
    const caso = resultados.find(c => c.mascota.id === id)
    if (!caso) return

    toast.success(`¡Gracias por querer adoptar a ${caso.mascota.nombre}! 🐶🐱`)
    setMostrandoHistoria(false)
    router.push(`/adoptar/formulario-adopcion?id=${caso.mascota.id}`)
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#28180d] font-body-editorial flex flex-col selection:bg-[#ff6b6b] selection:text-white">


      {/* 2. Main Content */}
      <main className="flex-grow py-16 px-6 md:px-12 max-w-[1280px] mx-auto w-full">
        {/* Titulación Hero Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#6c2f00] font-bold mb-6 tracking-tight leading-[1.1]">
            Nuestros Amigos Esperan
          </h1>
          <p className="font-body-editorial text-base sm:text-lg md:text-xl text-[#54433a] leading-relaxed">
            Cada uno de estos animales tiene una historia única y está listo para comenzar un nuevo capítulo. Encuentra a tu compañero ideal.
          </p>
        </div>

        {/* 3. Filtros de Búsqueda Integrados */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-14">
          {/* Filtro por Tipo */}
          <div className="relative w-full sm:w-1/2">
            <select
              className="appearance-none w-full px-5 py-3 pr-10 border border-[#6c2f00]/20 bg-white text-[#6c2f00] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all cursor-pointer"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'perro' | 'gato' | '')}
              aria-label="Filtrar por tipo de mascota"
            >
              <option value="">Todos los animales</option>
              <option value="perro">Perros</option>
              <option value="gato">Gatos</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6c2f00]">
              <span className="material-symbols-outlined text-xl">expand_more</span>
            </div>
          </div>

          {/* Filtro por Orden */}
          <div className="relative w-full sm:w-1/2">
            <select
              className="appearance-none w-full px-5 py-3 pr-10 border border-[#6c2f00]/20 bg-white text-[#6c2f00] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all cursor-pointer"
              value={orden}
              onChange={(e) => setOrden(e.target.value as 'mas_reciente' | 'mas_antiguo')}
              aria-label="Ordenar mascotas"
            >
              <option value="mas_reciente">Más reciente</option>
              <option value="mas_antiguo">Más antiguo</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6c2f00]">
              <span className="material-symbols-outlined text-xl">swap_vert</span>
            </div>
          </div>
        </div>

        {/* Estados de Carga y Error */}
        {cargando && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-[#6c2f00] animate-spin mb-2">progress_activity</span>
            <p className="font-body-editorial text-base text-[#54433a]">Cargando compañeros en adopción...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 p-4 rounded-xl bg-red-50 border border-red-200 max-w-md mx-auto">
            <p className="font-body-editorial text-sm text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {!cargando && resultados.length === 0 && (
          <div className="text-center py-16 bg-[#fff1ea] rounded-2xl border border-[#6c2f00]/10">
            <span className="material-symbols-outlined text-5xl text-[#6c2f00]/40 mb-3">pets</span>
            <p className="font-body-editorial text-lg text-[#54433a] font-medium">No se encontraron mascotas con el filtro seleccionado.</p>
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
              }

              return (
                <MascotaCard
                  key={caso.id}
                  mascota={mascota}
                  onConocerHistoria={() => handleConocerHistoria(mascota)}
                  onAdoptar={() => handleAdoptar(mascota.id)}
                  modo="adopcion"
                />
              )
            })}
          </div>
        )}
      </main>

      {/* Modal de Historia / Detalles de la Mascota */}
      {mascotaSeleccionada && (
        <MascotaModal
          mascota={mascotaSeleccionada}
          visible={mostrandoHistoria}
          cargando={cargandoHistoria}
          onClose={() => setMostrandoHistoria(false)}
          onAccion={() => handleAdoptar(mascotaSeleccionada.id)}
          modo="adopcion"
        />
      )}

      {/* 5. Footer Editorial (Idéntico a la referencia) */}
      <footer className="bg-[#fbddca] w-full py-12 px-6 md:px-12 border-t border-[#dac2b6]/40 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto gap-8">
          <div className="font-display-editorial text-2xl font-bold text-[#6c2f00] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6c2f00]">pets</span>
            Hearts&amp;Paws
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-body-editorial text-sm font-semibold text-[#54433a]">
            <a href="#" className="hover:text-[#6c2f00] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#6c2f00] transition-colors">Términos</a>
            <a href="#" className="hover:text-[#6c2f00] transition-colors">Contacto</a>
            <a href="#" className="hover:text-[#6c2f00] transition-colors">Voluntariado</a>
          </nav>
          <div className="font-body-editorial text-sm text-[#6c2f00] text-center md:text-right font-medium">
            © 2024 Hearts&amp;Paws. Cada huella cuenta una historia.
          </div>
        </div>
      </footer>
    </div>
  )
}

