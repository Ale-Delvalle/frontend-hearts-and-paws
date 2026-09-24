"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getMascotasPorOng,
  getSolicitudesPorCaso,
  actualizarEstadoSolicitud,
  MascotaConSolicitudes,
} from "@/services/adoptionsOng";



export default function AdoptionsOng() {
  const [data, setData] = useState<MascotaConSolicitudes[]>([]);
  const [expandida, setExpandida] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const mascotas = await getMascotasPorOng();
        const solicitudesData = await getSolicitudesPorCaso();

        type Solicitud = MascotaConSolicitudes['solicitudes'][number];
        const solicitudesMap = new Map<string, Solicitud[]>();
        solicitudesData.forEach(({ mascota, solicitudes }) => {
          solicitudesMap.set(mascota.id, solicitudes);
        });

        const combinedData: MascotaConSolicitudes[] = mascotas.map((mascota) => ({
          mascota,
          solicitudes: solicitudesMap.get(mascota.id) || [],
        }));

        setData(combinedData);
      } catch (error) {
        console.error("Error al cargar datos", error);
        toast.error("Error al cargar datos");
      } finally {
        setCargando(false);
      }
    }

    fetchData();
  }, []);

  const toggleExpandir = (id: string) => {
    setExpandida((prev) => (prev === id ? null : id));
  };

  const handleEstadoSolicitud = async (
    mascotaId: string,
    solicitudId: string,
    nuevoEstado: "ACEPTADA" | "RECHAZADA"
  ) => {
    const mascota = data.find((m) => m.mascota.id === mascotaId);
    const casoAdopcionId = mascota?.mascota.casos?.[0]?.adopcion?.id;

    if (!casoAdopcionId) return toast.error("No se encontró caso de adopción");

    setLoading(solicitudId);

    try {
      await actualizarEstadoSolicitud(casoAdopcionId, solicitudId, nuevoEstado);
      toast.success(`Solicitud ${nuevoEstado.toLowerCase()} con éxito`);

      setData((prev) =>
  prev.map((m) => {
    if (m.mascota.id !== mascotaId) return m;

    if (nuevoEstado === "ACEPTADA") {
      return {
        ...m,
        solicitudes: m.solicitudes
          .filter((s) => s.id === solicitudId)
          .map((s) => ({ ...s, estado: "ACEPTADA" })), 
      };
    }

    return {
      ...m,
      solicitudes: m.solicitudes.map((s) =>
        s.id === solicitudId ? { ...s, estado: "RECHAZADA" } : s
      ),
    };
  })
);

    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar estado");
    } finally {
      setLoading(null);
    }
  };

  if (cargando) {
    return (
      <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-12 text-center shadow-xs font-body-editorial">
        <div className="w-10 h-10 border-4 border-[#c85a32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display-editorial text-lg text-[#6c2f00] dark:text-[#ffdbc9] font-bold">Cargando solicitudes de adopción...</p>
      </div>
    );
  }

  const totalSolicitudes = data.reduce((acc, curr) => acc + (curr.solicitudes?.length || 0), 0);

  return (
    <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-6 sm:p-8 shadow-xs font-body-editorial transition-colors">
      {/* Encabezado */}
      <div className="mb-6 pb-6 border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fff1ea] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold mb-3">
          <span className="material-symbols-outlined text-base text-[#c85a32]">assignment</span>
          Gestión de Adopciones
        </div>
        <h1 className="font-display-editorial text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
          Solicitudes de Adopción
        </h1>
        <p className="text-sm text-[#54433a] dark:text-[#dac2b6] mt-1">
          Revisa las solicitudes recibidas para cada mascota, evalúa el cuestionario de adopción y gestiona las aprobaciones.
        </p>
      </div>

      {/* Lista de Mascotas con Solicitudes */}
      {data.length === 0 || totalSolicitudes === 0 ? (
        <div className="p-12 text-center bg-[#fff8f5] dark:bg-[#121214] rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
          <span className="material-symbols-outlined text-5xl text-[#6c2f00]/30 dark:text-[#ffdbc9]/30 mb-3">pets</span>
          <h3 className="font-display-editorial text-lg font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1">
            No tienes solicitudes de adopción aún
          </h3>
          <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6]">
            Cuando los usuarios completen el formulario de adopción para alguna de tus mascotas, podrás revisarlo aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map(({ mascota, solicitudes }) => {
            const estaExpandida = expandida === mascota.id;

            return (
              <div key={mascota.id} className="transition-all">
                {/* Botón Acordeón de Mascota */}
                <button
                  onClick={() => toggleExpandir(mascota.id)}
                  className={`w-full flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    estaExpandida
                      ? "bg-[#fff1ea] dark:bg-[#26262e] border-[#6c2f00]/30 dark:border-[#ffdbc9]/30 shadow-xs"
                      : "bg-[#fff8f5] dark:bg-[#121214] border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 hover:border-[#6c2f00]/30 dark:hover:border-[#ffdbc9]/30"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={mascota.imagenes?.[0]?.url || "/placeholder.jpg"}
                      alt={mascota.nombre}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <h2 className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] truncate">
                        {mascota.nombre}
                      </h2>
                      <span className="inline-flex items-center gap-1 bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                        <span className="material-symbols-outlined text-xs text-[#c85a32]">mail</span>
                        {solicitudes.length} {solicitudes.length === 1 ? "solicitud" : "solicitudes"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`material-symbols-outlined text-2xl text-[#6c2f00] dark:text-[#ffdbc9] transition-transform duration-200 shrink-0 ${
                      estaExpandida ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {/* Contenido Desplegable con Solicitudes */}
                {estaExpandida && (
                  <div className="mt-3 p-4 sm:p-6 bg-[#fff8f5]/60 dark:bg-[#121214]/60 border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 rounded-2xl space-y-4">
                    {solicitudes.length > 0 ? (
                      solicitudes.map((sol) => {
                        const estadoConfig: Record<string, { label: string; icon: string; classes: string }> = {
                          PENDIENTE: {
                            label: "Pendiente",
                            icon: "hourglass_empty",
                            classes: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
                          },
                          ACEPTADA: {
                            label: "Aceptada",
                            icon: "check_circle",
                            classes: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
                          },
                          RECHAZADA: {
                            label: "Rechazada",
                            icon: "cancel",
                            classes: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
                          },
                        };

                        const estadoSol = estadoConfig[sol.estado] || {
                          label: sol.estado,
                          icon: "help",
                          classes: "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800",
                        };

                        return (
                          <div
                            key={sol.id}
                            className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-2xl p-5 shadow-xs space-y-4"
                          >
                            {/* Header de la solicitud */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-[#c85a32]">person</span>
                                <Link
                                  href={`/usuario/${sol.usuario.id}`}
                                  className="font-display-editorial text-lg font-bold text-[#6c2f00] dark:text-[#ffdbc9] hover:underline"
                                >
                                  {sol.usuario.nombre}
                                </Link>
                              </div>

                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${estadoSol.classes}`}
                              >
                                <span className="material-symbols-outlined text-xs">{estadoSol.icon}</span>
                                {estadoSol.label}
                              </span>
                            </div>

                            {/* Cuestionario familiar */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#54433a] dark:text-[#dac2b6] bg-[#fff8f5] dark:bg-[#121214] p-4 rounded-xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">Email:</strong> {sol.usuario.email}
                              </p>
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">Teléfono:</strong> {sol.usuario.telefono || "No especificado"}
                              </p>
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">Tipo de Vivienda:</strong> {sol.tipoVivienda}
                              </p>
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">Integrantes Familia:</strong> {sol.integrantesFlia}
                              </p>
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">Hijos:</strong> {sol.hijos}
                              </p>
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">¿Otras Mascotas?:</strong> {sol.hayOtrasMascotas}
                              </p>
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">¿Cubre gastos?:</strong> {sol.cubrirGastos}
                              </p>
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">¿Alimento y cuidados?:</strong> {sol.darAlimentoCuidados}
                              </p>
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">¿Amor y ejercicio?:</strong> {sol.darAmorTiempoEj}
                              </p>
                              <p>
                                <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">¿Acepta devolución?:</strong> {sol.devolucionDeMascota}
                              </p>
                              {sol.declaracionFinal && (
                                <p className="sm:col-span-2 pt-1 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
                                  <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">Declaración final:</strong> {sol.declaracionFinal}
                                </p>
                              )}
                            </div>

                            {/* Acciones para solicitud pendiente */}
                            {sol.estado === "PENDIENTE" && (
                              <div className="flex items-center gap-3 pt-2">
                                <button
                                  onClick={() => handleEstadoSolicitud(mascota.id, sol.id, "ACEPTADA")}
                                  disabled={loading === sol.id}
                                  className="bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold text-xs px-5 py-2 rounded-full transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined text-sm">check</span>
                                  {loading === sol.id ? "Procesando..." : "Aceptar"}
                                </button>
                                <button
                                  onClick={() => handleEstadoSolicitud(mascota.id, sol.id, "RECHAZADA")}
                                  disabled={loading === sol.id}
                                  className="border border-rose-300 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs px-5 py-2 rounded-full transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                  {loading === sol.id ? "Procesando..." : "Rechazar"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="p-4 text-xs text-[#54433a] dark:text-[#dac2b6] text-center italic">
                        No hay solicitudes para esta mascota actualmente.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}