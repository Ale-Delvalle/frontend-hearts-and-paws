'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { useOngAuth } from '@/context/OngAuthContext'
import { useAuth } from '@/components/SupabaseProvider'
import GlobalTimeline from '@/components/components-feed/GlobalTimeline'

export default function PublicacionesPage() {
  const router = useRouter()
  const { usuario, loading: loadingUsuario } = useUsuarioAuth()
  const { ong, loading: loadingOng } = useOngAuth()
  const { user } = useAuth()

  const estaCargando = loadingUsuario || loadingOng
  const estaAutenticado = Boolean(usuario || ong || user)

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.replace('/login')
    }
  }, [estaCargando, estaAutenticado, router])

  if (estaCargando) {
    return (
      <div className="py-16 px-6 md:px-12 max-w-2xl mx-auto w-full flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-64 bg-[#fff1ea] dark:bg-[#26262e] rounded-xl mx-auto" />
        <div className="h-4 w-96 bg-[#fff1ea] dark:bg-[#26262e] rounded mx-auto" />
        <div className="h-96 bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 mt-6" />
      </div>
    )
  }

  if (!estaAutenticado) {
    return null
  }

  return (
    <div className="py-12 md:py-16 px-6 md:px-12 max-w-[1280px] mx-auto">
      {/* Header editorial */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c85a32]/10 dark:bg-[#c85a32]/20 text-[#c85a32] mb-4 border border-[#c85a32]/20">
          <span className="material-symbols-outlined text-3xl">pets</span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] tracking-tight">
          Publicaciones
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
          Casos activos, avisos y novedades compartidas en tiempo real por nuestra red de organizaciones aliadas.
        </p>
      </div>

      {/* Feed de publicaciones */}
      <GlobalTimeline />
    </div>
  )
}
