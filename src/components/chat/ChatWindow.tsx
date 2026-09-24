'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useChatSocket } from '@/hooks/useChatSocket';
import { Mensaje } from '@/types/chat';
import { obtenerMensajes } from '@/services/chatService';
import { useAuth } from '../SupabaseProvider';

interface ChatWindowProps {
  chatId: string;
  autorId: string;
  autorNombre: string;
  /** true si quien tiene la ventana abierta es una ONG: en ese caso, el otro participante del chat es siempre un Usuario. */
  esOng?: boolean;
}

export default function ChatWindow({ chatId, autorId, autorNombre, esOng = false }: ChatWindowProps) {
  const [mensajesIniciales, setMensajesIniciales] = useState<Mensaje[]>([]);
  const [contenido, setContenido] = useState('');
  const { mensajes, enviarMensaje } = useChatSocket(chatId, autorId, autorNombre);
  const { token } = useAuth();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await obtenerMensajes(token ?? undefined, chatId);
        setMensajesIniciales(res.mensajes || []);
      } catch (error) {
        console.error('Error cargando mensajes iniciales:', error);
      }
    };

    setMensajesIniciales([]); 
    fetchMensajes();
    setContenido(''); 
  }, [chatId, token]);

  
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [mensajes, mensajesIniciales]);

  const handleEnviar = () => {
    if (!contenido.trim()) return;
    enviarMensaje(contenido);
    setContenido('');
  };

  const mensajesTotales = [...mensajesIniciales, ...mensajes];

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-white/40 dark:bg-black/20 p-4 overflow-hidden">
      {/* Mensajes */}
      <div
        ref={chatRef}
        className="flex-grow overflow-y-auto px-4 py-4 mb-3 space-y-3 flex flex-col"
      >
        {mensajesTotales.map((msg) => {
          const esAutor = msg.autor?.id === autorId;
          const hora = msg.enviado_en
            ? new Date(msg.enviado_en).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

          return (
            <div
              key={msg.id}
              className={`max-w-[85%] sm:max-w-[75%] break-words px-4 py-2.5 shadow-sm text-sm ${
                esAutor
                  ? 'bg-[#c85a32] text-white self-end text-right rounded-2xl rounded-tr-none'
                  : 'bg-[#ffeade] dark:bg-[#26262e] text-[#1c1c21] dark:text-[#ffede4] self-start text-left rounded-2xl rounded-tl-none border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10'
              }`}
            >
              <div
                className={`text-xs font-semibold mb-1 ${
                  esAutor ? 'text-white/90' : 'text-[#6c2f00] dark:text-[#ffdbc9]'
                }`}
              >
                {!esAutor && esOng && msg.autor?.id ? (
                  <Link href={`/usuario/${msg.autor.id}`} className="hover:underline">
                    {msg.autor?.nombre || 'Anon'}
                  </Link>
                ) : (
                  msg.autor?.nombre || 'Anon'
                )}
              </div>
              <div className="leading-relaxed">{msg.contenido}</div>
              {hora && (
                <div
                  className={`text-[10px] mt-1 ${
                    esAutor ? 'text-white/75' : 'text-[#54433a] dark:text-[#dac2b6]'
                  }`}
                >
                  {hora}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEnviar();
        }}
        className="flex items-center gap-2 pt-2 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10"
      >
        <input
          type="text"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 rounded-full px-4 py-2.5 text-sm text-[#1c1c21] dark:text-[#ffede4] placeholder-[#54433a]/60 dark:placeholder-[#dac2b6]/60 focus:outline-none focus:border-[#c85a32] transition-all shadow-sm"
        />
        <button
          type="submit"
          className="bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0"
          title="Enviar"
        >
          <span className="text-sm hidden sm:inline">Enviar</span>
          <span className="material-symbols-outlined text-base">send</span>
        </button>
      </form>
    </div>
  );
}
