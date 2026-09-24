"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { connectSocket } from "@/lib/socket";
import {
  obtenerChatsDeOng,
  obtenerChatsDeUsuario,
  iniciarChat,
  obtenerUsuariosDisponibles,
  obtenerOngsDisponibles,
  iniciarChatComoOng,
} from "@/services/chatService";
import { useAuth } from "../SupabaseProvider";

interface Destinatario {
  id: string;
  nombre: string;
  conectado: boolean;
}

interface ChatSidebarProps {
  esOng: boolean;
  userId: string;
  onSelectChat: (chatId: string) => void;
}

interface Chat {
  id: string;
  usuarioId: string;
  organizacionId: string;
  usuario?: { id: string; nombre: string };
  organizacion?: {
    id: string;
    nombre: string;
    email?: string;
    imagenPerfil?: string | null;
  };
  ultimoMensaje?: {
    id: string;
    contenido: string;
    enviado_en: string;
    autor: {
      id: string;
      nombre: string;
    };
  } | null;
  ultimoMensajeId?: string | null;
  creado_en?: string;
}
interface MensajeNuevo {
  chatId: string;
  contenido: string;
  id: string;
  enviado_en: string;
  autor: {
    id: string;
    nombre: string;
  };
}


export default function ChatSidebar({ esOng, userId, onSelectChat }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const { token } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) {
      console.warn("No hay userId disponible todavía");
      return;
    }

    const fetchChats = async () => {
  try {
    setLoading(true);
    setError(null);

    console.log("📦 Cargando chats con:", { userId, token, esOng });

    const data = esOng
      ? await obtenerChatsDeOng(userId, token!)
      : await obtenerChatsDeUsuario(userId, token!);

    console.log("✅ Chats recibidos:", data);
    setChats(data?.chats || []);
  } catch (err) {
    console.error("❌ Error al obtener chats:", err);

    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Error desconocido al cargar chats");
    }
  } finally {
    setLoading(false);
  }
};
    fetchChats();
  }, [esOng, userId, token]);

  useEffect(() => {
    if (!userId || !token) return;

    const socket = connectSocket();
    socket.emit("identify", { userId, token });

    const handleNewMessage = (mensaje:MensajeNuevo ) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === mensaje.chatId ? { ...chat, ultimoMensaje: mensaje } : chat
        )
      );
    };

    const handleEstadoUsuarios = (usuarios: Destinatario []) => {
      setDestinatarios((prev) =>
        prev.map((dest) => {
          const actualizado = usuarios.find((u) => u.id === dest.id);
          return actualizado
            ? { ...dest, conectado: actualizado.conectado }
            : dest;
        })
      );
    };

    socket.on("messageReceived", handleNewMessage);
    socket.on("estadoUsuarios", handleEstadoUsuarios);

    return () => {
      socket.off("messageReceived", handleNewMessage);
      socket.off("estadoUsuarios", handleEstadoUsuarios);
    };
  }, [userId, token]);

  const handleToggleDropdown = async () => {
    if (mostrarDropdown) {
      setMostrarDropdown(false);
      return;
    }

    try {
      const data = esOng
        ? await obtenerUsuariosDisponibles(token!)
        : await obtenerOngsDisponibles(token!);

      setDestinatarios(data || []);
      setMostrarDropdown(true);

      const socket = connectSocket();
      socket.emit("solicitarEstadoUsuarios");
    } catch {
      alert("Error al cargar destinatarios");
    }
  };

  const handleSeleccionarDestinatario = async (destinatarioId: string) => {
    try {
      const res = esOng
        ? await iniciarChatComoOng(destinatarioId, userId, token!)
        : await iniciarChat(userId, destinatarioId, token!);

      onSelectChat(res.chat.id);
      setMostrarDropdown(false);
    } catch (error) {
      console.error("Error iniciando chat:", error);
      alert("Error al iniciar chat");
    }
  };

  return (
    <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 p-4 flex flex-col bg-[#fff8f5]/60 dark:bg-[#121214]/60 h-full flex-shrink-0">
      <button
        onClick={handleToggleDropdown}
        className="mb-3 w-full bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold py-2.5 px-4 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center gap-2 text-sm"
      >
        <span className="material-symbols-outlined text-base">
          {mostrarDropdown ? "close" : "add_comment"}
        </span>
        <span>{mostrarDropdown ? "Cerrar lista" : "Iniciar nuevo chat"}</span>
      </button>

      {mostrarDropdown && (
        <div
          ref={dropdownRef}
          className="mb-3 max-h-56 overflow-y-auto border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 rounded-xl shadow-lg bg-[#fff1ea] dark:bg-[#1c1c21] divide-y divide-[#6c2f00]/10 dark:divide-[#ffdbc9]/10"
        >
          {destinatarios.length === 0 ? (
            <p className="p-4 text-center text-[#54433a] dark:text-[#dac2b6] text-sm">
              No hay destinatarios disponibles
            </p>
          ) : (
            <ul>
              {destinatarios.map((dest) => (
                <li
                  key={dest.id}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] cursor-pointer transition-colors"
                  onClick={() => handleSeleccionarDestinatario(dest.id)}
                >
                  {esOng ? (
                    <Link
                      href={`/usuario/${dest.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-medium text-[#1c1c21] dark:text-[#ffede4] hover:text-[#c85a32] hover:underline"
                    >
                      {dest.nombre}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-[#1c1c21] dark:text-[#ffede4]">
                      {dest.nombre}
                    </span>
                  )}
                  <span
                    className={`ml-2 w-2.5 h-2.5 rounded-full ${
                      dest.conectado ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    title={dest.conectado ? "Conectado" : "Desconectado"}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="relative mb-3">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#54433a] dark:text-[#dac2b6] pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 rounded-xl text-[#1c1c21] dark:text-[#ffede4] placeholder-[#54433a]/60 dark:placeholder-[#dac2b6]/60 focus:outline-none focus:border-[#c85a32] transition-all"
        />
      </div>

      {loading ? (
        <div className="text-sm text-[#54433a] dark:text-[#dac2b6] flex items-center gap-2 py-4 justify-center">
          <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
          <span>Cargando chats...</span>
        </div>
      ) : error ? (
        <div className="text-xs text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
          ⚠️ {error}
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-6 text-sm text-[#54433a] dark:text-[#dac2b6]">
          <span className="material-symbols-outlined text-3xl opacity-40 block mb-1">chat_bubble_outline</span>
          No tienes chats activos
        </div>
      ) : (
        <ul className="flex-grow overflow-y-auto space-y-2 pr-1">
          {chats
            .filter((chat) => {
              const nombre =
                chat.usuarioId === userId
                  ? chat.organizacion?.nombre || ""
                  : chat.usuario?.nombre || "";
              return nombre.toLowerCase().includes(filtro.toLowerCase());
            })
            .map((chat) => {
              const otroEsUsuario = chat.usuarioId !== userId;
              const otroNombre = otroEsUsuario
                ? chat.usuario?.nombre || "Sin nombre"
                : chat.organizacion?.nombre || "Sin nombre";

              const inicial = otroNombre.charAt(0).toUpperCase();

              return (
                <li
                  key={chat.id}
                  className="flex items-center gap-3 p-3 bg-white/70 dark:bg-[#26262e]/60 hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 rounded-xl cursor-pointer transition-all duration-200"
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#ffeade] dark:bg-[#6c2f00]/40 text-[#6c2f00] dark:text-[#ffdbc9] font-bold text-sm flex items-center justify-center flex-shrink-0 border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15">
                    {inicial}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    {otroEsUsuario ? (
                      <Link
                        href={`/usuario/${chat.usuario?.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="truncate text-sm text-[#1c1c21] dark:text-[#ffede4] font-semibold hover:text-[#c85a32] hover:underline w-fit"
                      >
                        {otroNombre}
                      </Link>
                    ) : (
                      <strong className="truncate text-sm text-[#1c1c21] dark:text-[#ffede4] font-semibold">
                        {otroNombre}
                      </strong>
                    )}
                    <p className="text-xs text-[#54433a] dark:text-[#dac2b6] truncate mt-0.5">
                      {chat.ultimoMensaje?.contenido || "Sin mensajes aún"}
                    </p>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </aside>
  );
}
