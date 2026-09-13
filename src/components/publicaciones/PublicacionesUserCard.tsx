'use client'

import Link from 'next/link'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { useOngAuth } from '@/context/OngAuthContext'
import { useAuth } from '@/components/SupabaseProvider'

export default function PublicacionesUserCard() {
  const { usuario } = useUsuarioAuth()
  const { ong } = useOngAuth()
  const { user } = useAuth()

  if (ong) {
    return (
      <div className="bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-5 shadow-sm font-body-editorial">
        {/* Cabecera ONG */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-[#6c2f00]/10 dark:border-[#c85a32]/15">
          {ong.imagenPerfil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ong.imagenPerfil}
              alt={ong.nombre}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#c85a32] shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-[#c85a32] bg-[#ffeade] dark:bg-[#26262e] flex items-center justify-center font-serif font-bold text-lg text-[#6c2f00] dark:text-[#ffdbc9] shrink-0">
              {ong.nombre?.charAt(0).toUpperCase() || 'O'}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="font-serif font-bold text-base text-[#6c2f00] dark:text-[#ffdbc9] truncate">
              {ong.nombre}
            </h3>
            <p className="text-xs text-[#54433a]/80 dark:text-[#dac2b6]/80 truncate">
              {[ong.ciudad, ong.pais].filter(Boolean).join(', ') || 'Organización'}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#c85a32] bg-[#fff1ea] dark:bg-[#26262e] px-2 py-0.5 rounded-full mt-1 border border-[#c85a32]/20">
              <span className="material-symbols-outlined text-xs">verified</span>
              ONG Aliada
            </span>
          </div>
        </div>

        {/* Acciones Rápidas ONG */}
        <div className="pt-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#54433a]/70 dark:text-[#dac2b6]/70 mb-2">
            Acciones de la ONG
          </p>
          <Link
            href="/dashboard/ong/crear-caso"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold bg-[#c85a32] hover:bg-[#a84320] text-white transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Crear Caso</span>
          </Link>
          <Link
            href="/dashboard/ong/nueva-mascota"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all"
          >
            <span className="material-symbols-outlined text-lg text-[#c85a32]">pets</span>
            <span>Registrar Mascota</span>
          </Link>
          <Link
            href="/dashboard/ong"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all"
          >
            <span className="material-symbols-outlined text-lg text-[#c85a32]">account_circle</span>
            <span>Mi Perfil de ONG</span>
          </Link>
        </div>
      </div>
    )
  }

  const nombreUsuario = usuario?.nombre || user?.user_metadata?.full_name || 'Amigo de Hearts & Paws'
  const emailUsuario = usuario?.email || user?.email || ''
  const imagenUsuario = usuario?.imagenPerfil || user?.user_metadata?.avatar_url
  const esAdmin = usuario?.rol === 'ADMIN'

  return (
    <div className="bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-5 shadow-sm font-body-editorial">
      {/* Cabecera Usuario */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-[#6c2f00]/10 dark:border-[#c85a32]/15">
        {imagenUsuario ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagenUsuario}
            alt={nombreUsuario}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#c85a32] shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-[#c85a32] bg-[#ffeade] dark:bg-[#26262e] flex items-center justify-center font-serif font-bold text-lg text-[#6c2f00] dark:text-[#ffdbc9] shrink-0">
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-serif font-bold text-base text-[#6c2f00] dark:text-[#ffdbc9] truncate">
            {nombreUsuario}
          </h3>
          <p className="text-xs text-[#54433a]/80 dark:text-[#dac2b6]/80 truncate">
            {emailUsuario}
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#c85a32] bg-[#fff1ea] dark:bg-[#26262e] px-2 py-0.5 rounded-full mt-1 border border-[#c85a32]/20">
            {esAdmin ? 'Administrador' : 'Comunidad'}
          </span>
        </div>
      </div>

      {/* Enlaces Rápidos Usuario */}
      <div className="pt-4 space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#54433a]/70 dark:text-[#dac2b6]/70 mb-2">
          Mi Actividad
        </p>
        <Link
          href="/usuario/adopciones"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all"
        >
          <span className="material-symbols-outlined text-lg text-[#c85a32]">favorite</span>
          <span>Mis Adopciones</span>
        </Link>
        <Link
          href="/usuario/donaciones"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all"
        >
          <span className="material-symbols-outlined text-lg text-[#c85a32]">volunteer_activism</span>
          <span>Mis Donaciones</span>
        </Link>
        <Link
          href="/usuario/favoritos"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all"
        >
          <span className="material-symbols-outlined text-lg text-[#c85a32]">star</span>
          <span>Mis Favoritos</span>
        </Link>
        <Link
          href="/chat"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all"
        >
          <span className="material-symbols-outlined text-lg text-[#c85a32]">chat</span>
          <span>Mensajes / Chat</span>
        </Link>
        {esAdmin && (
          <Link
            href="/dashboard/admin/resumen"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#c85a32] hover:bg-[#ffeade] dark:hover:bg-[#26262e] transition-all mt-1"
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            <span>Panel Admin</span>
          </Link>
        )}
      </div>
    </div>
  )
}
