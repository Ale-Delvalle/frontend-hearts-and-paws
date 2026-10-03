'use client';

import { useEffect, useState } from 'react';
import { UsuarioPerfilPublico } from '@/types/user';
import { getPerfilPublicoUsuario } from '@/services/userProfile';
import InsigniaBadge from '@/components/insignias/InsigniaBadge';
import { optimizarAvatar } from '@/utils/cloudinaryImage';

export default function UsuarioPerfilPage({ id }: { id: string }) {
  const [usuario, setUsuario] = useState<UsuarioPerfilPublico | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPerfil() {
      setCargando(true);
      setError('');
      try {
        const data = await getPerfilPublicoUsuario(id);
        setUsuario(data);
      } catch {
        setError('No se encontró el usuario que buscás.');
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    }
    cargarPerfil();
  }, [id]);

  return (
    <div className="bg-[#fff8f5] dark:bg-[#121214] min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 font-body-editorial transition-colors">
      {cargando && (
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 bg-white dark:bg-[#1c1c21] rounded-3xl shadow-xs border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-6 sm:p-8 animate-pulse">
          <div className="w-28 h-28 rounded-full bg-[#ffeade] dark:bg-[#26262e]" />
          <div className="h-6 w-40 bg-[#ffeade] dark:bg-[#26262e] rounded-xl" />
          <div className="h-4 w-24 bg-[#ffeade] dark:bg-[#26262e] rounded-lg" />
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-[#fff1ea] dark:bg-[#1c1c21] border border-[#c85a32]/30 text-center shadow-xs">
          <span className="material-symbols-outlined text-4xl text-[#c85a32] mb-2">error</span>
          <p className="text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9]">{error}</p>
        </div>
      )}

      {!cargando && usuario && (
        <div className="w-full max-w-md mx-auto flex flex-col items-center text-center gap-4 bg-white dark:bg-[#1c1c21] rounded-3xl shadow-xs border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-6 sm:p-8 transition-colors">
          {usuario.imagenPerfil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={optimizarAvatar(usuario.imagenPerfil, 112)}
              alt={`Foto de perfil de ${usuario.nombre}`}
              className="w-28 h-28 object-cover rounded-full border-4 border-[#c85a32] shadow-sm"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-[#c85a32] shadow-sm bg-[#ffeade] dark:bg-[#26262e] flex items-center justify-center text-3xl font-bold font-display-editorial text-[#6c2f00] dark:text-[#ffdbc9]">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="space-y-1">
            <h1 className="font-display-editorial text-2xl sm:text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] leading-tight tracking-tight">
              {usuario.nombre}
            </h1>

            {(usuario.ciudad || usuario.pais) && (
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a84320] dark:text-[#e06b3f] flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {[usuario.ciudad, usuario.pais].filter(Boolean).join(', ')}
              </p>
            )}

            <p className="text-xs text-[#54433a] dark:text-[#dac2b6]">
              Miembro desde{' '}
              {new Date(usuario.creado_en).toLocaleDateString('es-ES', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {usuario.insignias.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-[#6c2f00]/10 dark:border-[#c85a32]/20 w-full">
              {usuario.insignias.map((insignia) => (
                <InsigniaBadge key={insignia.id} insignia={insignia} genero={usuario.genero} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
