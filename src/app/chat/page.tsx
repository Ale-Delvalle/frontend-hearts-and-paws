'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOngAuth } from '@/context/OngAuthContext';
import { useUsuarioAuth } from '@/context/UsuarioAuthContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuth } from '@/components/SupabaseProvider';
import { fetchConToken } from '@/services/saveToken';

export default function ChatPage() {
  const router = useRouter();
  const { ong } = useOngAuth();
  const { usuario } = useUsuarioAuth();
  const { user, token: supabaseToken } = useAuth();

  const [chatIdSeleccionado, setChatIdSeleccionado] = useState<string | null>(null);
  const [uidSync, setUidSync] = useState<string>('');

  // Determinar el tipo de usuario
  const esOng = !!ong;
  const esUsuarioLocal = !!usuario && !user; // Solo si no hay sesión Supabase
  const esUsuarioSupabase = !!user;

  // Obtener el userId dependiendo del tipo de usuario
  let userId = '';
  if (esOng && ong?.id) {
    userId = ong.id;
  } else if (esUsuarioLocal && usuario?.id) {
    userId = usuario.id;
  } else if (esUsuarioSupabase && uidSync) {
    userId = uidSync;
  }

  // Obtener nombre del autor
  const autorNombre =
    ong?.nombre ||
    usuario?.nombre ||
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    'Usuario sin nombre';

  // Obtener ID desde Supabase si aplica
  useEffect(() => {
    const obtenerUid = async () => {
      if (supabaseToken && esUsuarioSupabase) {
        try {
          const data = await fetchConToken(supabaseToken);
          if (data?.id) {
            console.log('User ID desde Supabase token:', data.id);
            setUidSync(data.id);
          }
        } catch (error) {
          console.error('Error al sincronizar ID:', error);
        }
      }
    };

    obtenerUid();
  }, [supabaseToken, esUsuarioSupabase]);

  // Mostrar mensaje si el ID de usuario no está disponible
  if (!userId) {
    return (
      <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] flex items-center justify-center text-[#54433a] dark:text-[#dac2b6] font-body-editorial">
        <span className="material-symbols-outlined text-3xl text-[#6c2f00] dark:text-[#ffdbc9] animate-spin mr-2">progress_activity</span>
        <span>Cargando datos de usuario...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial flex justify-center py-10 md:py-16 px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-start justify-center gap-6 lg:gap-8 max-w-5xl w-full">
        {/* Sidebar centrado estilo Earth & Heart */}
        <nav className="flex flex-col p-6 bg-[#ffeade] dark:bg-[#1c1c21] rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 w-full md:w-64 shadow-none flex-shrink-0">
          <div className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#ffdbc9]">person</span>
            <span>Perfil</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/dashboard/usuario")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">home</span>
              <span>Principal</span>
            </button>
            <button
              onClick={() => router.push("/usuario/adopciones")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">pets</span>
              <span>Mis Adopciones</span>
            </button>
            <button
              onClick={() => router.push("/usuario/donaciones")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">volunteer_activism</span>
              <span>Mis Donaciones</span>
            </button>
            <button
              onClick={() => router.push("/usuario/favoritos")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">favorite</span>
              <span>Mis Favoritos</span>
            </button>
            <button
              onClick={() => router.push("/chat")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold bg-[#fff1ea] dark:bg-[#26262e] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>Mensajes</span>
            </button>
          </div>
        </nav>

        {/* Contenido principal de Chat */}
        <main className="flex-1 w-full max-w-3xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="font-display-editorial text-3xl md:text-4xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
                Mensajes
              </h1>
              <p className="font-body-editorial text-sm text-[#54433a] dark:text-[#dac2b6] mt-1">
                Comunícate directamente con las organizaciones
              </p>
            </div>
          </div>

          <div className="bg-[#fff1ea] dark:bg-[#1c1c21] rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-none overflow-hidden flex flex-col md:flex-row h-[620px] w-full">
            <ChatSidebar
              esOng={esOng}
              userId={userId}
              onSelectChat={setChatIdSeleccionado}
            />
            {chatIdSeleccionado ? (
              <ChatWindow
                chatId={chatIdSeleccionado}
                autorId={userId}
                autorNombre={autorNombre}
                esOng={esOng}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#54433a] dark:text-[#dac2b6] bg-white/40 dark:bg-black/20">
                <span className="material-symbols-outlined text-5xl text-[#6c2f00] dark:text-[#ffdbc9] mb-3 opacity-50">chat</span>
                <p className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1">Tus Conversaciones</p>
                <p className="text-sm max-w-xs">Selecciona un chat de la lista o inicia uno nuevo para comenzar a hablar.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
