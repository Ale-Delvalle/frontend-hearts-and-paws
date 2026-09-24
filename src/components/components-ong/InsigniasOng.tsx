"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  buscarUsuarios,
  getInsigniasOtorgadas,
  otorgarInsignia,
  revocarInsignia,
} from "@/services/insigniasOng";
import { InsigniaOtorgada, TipoInsignia, UsuarioBuscado } from "@/types/insignia";

const MIN_CARACTERES = 3;

const ETIQUETA_TIPO: Record<TipoInsignia, string> = {
  TRANSITO: "Tránsito",
  PADRINO: "Padrino/Madrina",
};

export default function InsigniasOng() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<UsuarioBuscado[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [otorgando, setOtorgando] = useState<string | null>(null);

  const [insignias, setInsignias] = useState<InsigniaOtorgada[]>([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [revocando, setRevocando] = useState<string | null>(null);

  const cargarInsignias = useCallback(async () => {
    setCargandoLista(true);
    try {
      const data = await getInsigniasOtorgadas();
      setInsignias(data);
    } catch (error) {
      console.error("Error cargando insignias:", error);
      toast.error("No se pudieron cargar las insignias otorgadas.");
    } finally {
      setCargandoLista(false);
    }
  }, []);

  useEffect(() => {
    cargarInsignias();
  }, [cargarInsignias]);

  useEffect(() => {
    const termino = busqueda.trim();
    if (termino.length < MIN_CARACTERES) {
      setResultados([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setBuscando(true);
      try {
        const data = await buscarUsuarios(termino);
        setResultados(data);
      } catch (error) {
        console.error("Error buscando usuarios:", error);
      } finally {
        setBuscando(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const handleOtorgar = async (usuarioId: string, tipo: TipoInsignia) => {
    setOtorgando(`${usuarioId}-${tipo}`);
    try {
      await otorgarInsignia(usuarioId, tipo);
      toast.success(`Insignia de ${ETIQUETA_TIPO[tipo]} otorgada.`);
      await cargarInsignias();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al otorgar la insignia.");
    } finally {
      setOtorgando(null);
    }
  };

  const handleRevocar = async (id: string) => {
    setRevocando(id);
    try {
      await revocarInsignia(id);
      toast.success("Insignia revocada.");
      setInsignias((prev) => prev.filter((i) => i.id !== id));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al revocar la insignia.");
    } finally {
      setRevocando(null);
    }
  };

  const yaTiene = (usuarioId: string, tipo: TipoInsignia) =>
    insignias.some((i) => i.usuario.id === usuarioId && i.tipo === tipo);

  return (
    <div className="space-y-8">
      {/* Buscador y alta de insignias */}
      <div className="bg-white dark:bg-[#1c1c21] rounded-2xl shadow-xs border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 p-6 md:p-8">
        <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-2">
          Otorgar insignia
        </h2>
        <p className="text-sm text-[#54433a] dark:text-[#dac2b6] mb-5">
          Buscá un usuario por nombre o email para reconocerlo como colaborador de tu organización.
        </p>

        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c2f00]/50 dark:text-[#ffdbc9]/50">
            search
          </span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o email (mínimo 3 caracteres)"
            className="w-full pl-11 pr-4 py-3 rounded-full text-sm bg-white dark:bg-[#26262e] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#1c1c21] dark:text-[#ffede4] focus:outline-none focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32]"
          />
        </div>

        {buscando && (
          <p className="text-xs text-[#54433a] dark:text-[#dac2b6] mb-3">Buscando...</p>
        )}

        {!buscando && busqueda.trim().length >= MIN_CARACTERES && resultados.length === 0 && (
          <p className="text-xs text-[#54433a] dark:text-[#dac2b6] mb-3">
            No se encontraron usuarios con ese criterio.
          </p>
        )}

        <div className="space-y-3">
          {resultados.map((usuario) => (
            <div
              key={usuario.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 bg-[#fff8f5] dark:bg-[#121214]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={usuario.imagenPerfil || "/default-avatar.png"}
                  alt={`Foto de perfil de ${usuario.nombre}`}
                  className="w-10 h-10 rounded-full object-cover border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15"
                />
                <div>
                  <Link
                    href={`/usuario/${usuario.id}`}
                    className="text-sm font-bold text-[#6c2f00] dark:text-[#ffdbc9] hover:underline"
                  >
                    {usuario.nombre}
                  </Link>
                  <p className="text-xs text-[#54433a] dark:text-[#dac2b6]">{usuario.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(["TRANSITO", "PADRINO"] as TipoInsignia[]).map((tipo) => {
                  const tieneInsignia = yaTiene(usuario.id, tipo);
                  const key = `${usuario.id}-${tipo}`;
                  return (
                    <button
                      key={tipo}
                      onClick={() => handleOtorgar(usuario.id, tipo)}
                      disabled={tieneInsignia || otorgando === key}
                      className="text-xs font-semibold px-4 py-2 rounded-full bg-[#c85a32] hover:bg-[#a84320] text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {tieneInsignia ? "check_circle" : "add"}
                      </span>
                      {tieneInsignia ? `Ya es ${ETIQUETA_TIPO[tipo]}` : `Otorgar ${ETIQUETA_TIPO[tipo]}`}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insignias otorgadas */}
      <div className="bg-white dark:bg-[#1c1c21] rounded-2xl shadow-xs border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 p-6 md:p-8">
        <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-5">
          Insignias otorgadas
        </h2>

        {cargandoLista ? (
          <p className="text-sm text-[#54433a] dark:text-[#dac2b6]">Cargando...</p>
        ) : insignias.length === 0 ? (
          <p className="text-sm text-[#54433a] dark:text-[#dac2b6]">
            Todavía no otorgaste ninguna insignia.
          </p>
        ) : (
          <div className="space-y-3">
            {insignias.map((insignia) => (
              <div
                key={insignia.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={insignia.usuario.imagenPerfil || "/default-avatar.png"}
                    alt={`Foto de perfil de ${insignia.usuario.nombre}`}
                    className="w-10 h-10 rounded-full object-cover border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15"
                  />
                  <div>
                    <Link
                      href={`/usuario/${insignia.usuario.id}`}
                      className="text-sm font-bold text-[#6c2f00] dark:text-[#ffdbc9] hover:underline"
                    >
                      {insignia.usuario.nombre}
                    </Link>
                    <p className="text-xs text-[#54433a] dark:text-[#dac2b6]">
                      {ETIQUETA_TIPO[insignia.tipo]} · desde{" "}
                      {new Date(insignia.otorgada_en).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRevocar(insignia.id)}
                  disabled={revocando === insignia.id}
                  className="text-xs font-semibold px-4 py-2 rounded-full border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  Revocar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
