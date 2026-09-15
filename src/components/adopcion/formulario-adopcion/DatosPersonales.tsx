'use client'

import { useEffect, useState } from 'react'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { supabase } from '@/lib/supabaseClient'

type DatosUsuario = {
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  ciudad?: string
  pais?: string
}

export default function DatosPersonales() {
  const { usuario } = useUsuarioAuth()
  const [datosSupabase, setDatosSupabase] = useState<DatosUsuario | null>(null)

  useEffect(() => {
    const obtenerDatos = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        const user = data.user
        const meta = user.user_metadata || {}
        setDatosSupabase({
          nombre: meta.nombre || '',
          email: user.email || '',
          telefono: meta.telefono || '',
          direccion: meta.direccion || '',
          ciudad: meta.ciudad || '',
          pais: meta.pais || '',
        })
      }
    }

    obtenerDatos()
  }, [])

  const datos = datosSupabase || usuario

  if (!datos) return null

  const items = [
    { label: 'Nombre completo', valor: datos.nombre },
    { label: 'Email', valor: datos.email },
    { label: 'Teléfono', valor: datos.telefono || 'No especificado' },
    { label: 'Dirección', valor: datos.direccion || 'No especificado' },
    { label: 'Ciudad', valor: datos.ciudad || 'No especificado' },
    { label: 'País', valor: datos.pais || 'No especificado' },
  ]

  return (
    <div className="space-y-6 max-w-2xl mx-auto font-body-editorial">
      {/* Encabezado */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#6c2f00]/10 text-[#6c2f00] dark:bg-[#c85a32]/20 dark:text-[#ffdbc9]">
          Paso 3 de 4 • Tu Información
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#6c2f00] dark:text-[#ffdbc9]">
          Datos Personales
        </h2>
        <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] max-w-lg mx-auto">
          Estos datos serán enviados junto con tu solicitud para que la protectora o rescatista pueda contactarte.
        </p>
      </div>

      {/* Grid de Datos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {items.map((dato, index) => (
          <div
            key={index}
            className="bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 rounded-2xl p-4 transition-all duration-200 hover:border-[#c85a32]/40 dark:hover:border-[#ff8a65]/40"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#c85a32] dark:text-[#ff8a65]">
                {index === 0 && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                {index === 1 && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {index === 2 && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )}
                {index === 3 && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {index === 4 && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10" />
                  </svg>
                )}
                {index === 5 && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#85736b] dark:text-[#a08f87]">
                {dato.label}
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-[#2d1810] dark:text-[#ffede4] break-words pl-6">
              {dato.valor}
            </p>
          </div>
        ))}
      </div>

      {/* Nota informativa de actualización */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#6c2f00]/5 dark:bg-[#2a2a33] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 text-[#54433a] dark:text-[#dac2b6] text-xs sm:text-sm">
        <svg className="w-5 h-5 text-[#c85a32] dark:text-[#ff8a65] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          Si deseas modificar alguno de estos datos, puedes actualizarlos en cualquier momento desde tu <span className="font-semibold text-[#6c2f00] dark:text-[#ffdbc9]">perfil de usuario</span> y volver a iniciar el formulario de adopción.
        </p>
      </div>
    </div>
  )
}
