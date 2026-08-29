import { OngPerfilPublico } from '@/types/ong'

export default function OngPerfilHeader({ ong }: { ong: OngPerfilPublico }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 pb-8 border-b border-[#ffcfc7] dark:border-zinc-700">
      {ong.imagenPerfil ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ong.imagenPerfil}
          alt={`Foto de perfil de ${ong.nombre}`}
          className="w-32 h-32 object-cover rounded-full border-4 border-[#e87366] shadow-md"
        />
      ) : (
        <div className="w-32 h-32 rounded-full border-4 border-[#e87366] shadow-md bg-[#ffece8] flex items-center justify-center text-3xl font-bold text-[#FA8072]">
          {ong.nombre.charAt(0).toUpperCase()}
        </div>
      )}

      <h1 className="text-3xl font-extrabold text-[#FA8072]">{ong.nombre}</h1>

      {(ong.ciudad || ong.pais) && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {[ong.ciudad, ong.pais].filter(Boolean).join(', ')}
        </p>
      )}

      {ong.descripcion && (
        <p className="text-gray-600 dark:text-gray-300 max-w-xl">{ong.descripcion}</p>
      )}

      <div className="flex gap-8 mt-2">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#FA8072]">{ong.mascotasActivas}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mascotas activas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#FA8072]">{ong.casosPublicados}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Casos publicados</p>
        </div>
      </div>
    </div>
  )
}
