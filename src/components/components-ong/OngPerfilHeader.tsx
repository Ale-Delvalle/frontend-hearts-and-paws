import { OngPerfilPublico } from '@/types/ong'

export default function OngPerfilHeader({ ong }: { ong: OngPerfilPublico }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-[#ffcfc7] dark:border-zinc-700 p-6">
      {ong.imagenPerfil ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ong.imagenPerfil}
          alt={`Foto de perfil de ${ong.nombre}`}
          className="w-28 h-28 object-cover rounded-full border-4 border-[#e87366] shadow-md"
        />
      ) : (
        <div className="w-28 h-28 rounded-full border-4 border-[#e87366] shadow-md bg-[#ffece8] flex items-center justify-center text-3xl font-bold text-[#FA8072]">
          {ong.nombre.charAt(0).toUpperCase()}
        </div>
      )}

      <h1 className="text-2xl font-extrabold text-[#FA8072] leading-tight">{ong.nombre}</h1>

      {(ong.ciudad || ong.pais) && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {[ong.ciudad, ong.pais].filter(Boolean).join(', ')}
        </p>
      )}

      {ong.descripcion && (
        <p className="text-gray-600 dark:text-gray-300 text-sm">{ong.descripcion}</p>
      )}

      <div className="flex justify-center gap-8 w-full mt-2 pt-4 border-t border-[#ffcfc7] dark:border-zinc-700">
        <div className="text-center">
          <p className="text-xl font-bold text-[#FA8072]">{ong.mascotasActivas}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Mascotas activas</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-[#FA8072]">{ong.casosPublicados}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Casos publicados</p>
        </div>
      </div>
    </div>
  )
}
