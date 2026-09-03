"use client";

import { useEffect, useState } from "react";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import toast from "react-hot-toast";
import {getTotalOrganizaciones, getVerificacion, Patchsolicitud } from "@/services/adminconexion";
import { OngUser } from "@/types/ong";



export default function AdminDashboard() {
 
  const [requests, setRequests] = useState<OngUser[]>([]);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const res = await getTotalOrganizaciones();
        if (!res || !res.ok) throw new Error("Error al obtener las ONGs");

        const data: OngUser[] = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error cargando solicitudes:", error);
      } finally {
        setLoading(false);
          }
    };

    fetchSolicitudes();
  }, []);


  const handleVerificacion = async (id: string) => {
      try {
        const res = await getVerificacion(id);
        if (!res || !res.ok) throw new Error("Error al obtener las ONGs");

     
      } catch (error) {
        console.error("Error cargando solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };


  const handleDecision = async (
    id: string,
    decision: "APROBADA" | "RECHAZADA"
  ) => {
    try {
      const res = await Patchsolicitud(id, decision);
      if (!res || !res.ok) throw new Error("Error actualizando estado");

      setRequests((prev) => prev.filter((req) => String(req.id) !== id));
      toast(
        `Solicitud ${id} fue ${
          decision === "APROBADA" ? "aceptada" : "rechazada"
        }.`
      );
    } catch (error) {
      console.error(
        `Error al ${
          decision === "APROBADA" ? "aceptar" : "rechazar"
        } solicitud`,
        error
      );
      toast("Hubo un error. Intenta nuevamente.");
    }
  };

  
  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#28180d] font-body-editorial flex flex-col selection:bg-[#ff6b6b] selection:text-white">
      <div className="flex-grow max-w-[1280px] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Encabezado Hero Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff1ea] border border-[#6c2f00]/15 text-[#6c2f00] font-body-editorial text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base">verified</span>
            Panel de Verificación
          </div>
          <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl text-[#6c2f00] font-bold tracking-tight mb-4 leading-[1.1]">
            Solicitudes de ONGs
          </h1>
          <p className="font-body-editorial text-base sm:text-lg text-[#54433a] leading-relaxed">
            Revisa, valida la documentación y gestiona las solicitudes de verificación pendientes para incorporar nuevas organizaciones a Hearts&amp;Paws.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-[#6c2f00] gap-3">
            <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
            <p className="font-semibold text-sm">Cargando solicitudes pendientes...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-[#54433a] bg-white border border-[#6c2f00]/15 rounded-2xl shadow-xs max-w-xl mx-auto font-body-editorial">
            <span className="material-symbols-outlined text-[#6c2f00] text-4xl mb-3">task_alt</span>
            <h3 className="font-display-editorial text-xl font-bold text-[#6c2f00] mb-2">Todo al día</h3>
            <p className="text-sm text-[#54433a]">No hay solicitudes de verificación de ONGs pendientes en este momento.</p>
          </div>
        ) : (
          requests.map((req: OngUser) => (
            <div
              key={req.id}
              className="p-5 mb-6 transition-shadow duration-200 bg-white dark:bg-zinc-900 border-2 border-[#FA8072] dark:border-zinc-700 rounded-lg shadow-lg"
            >
              <div className="flex gap-6">
                {/* Imagen de perfil */}
                <div className="flex-shrink-0">
                  <img
                    src={req.imagenPerfil}
                    alt={`Foto de perfil de ${req.nombre}`}
                    className="w-40 h-40 object-cover border-4 border-[#e87366] shadow-md rounded"
                  />
                </div>

                {/* Información textual */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="mb-1 text-xl font-semibold text-[#FA8072]">
                      {req.nombre}
                    </h2>
                    <p className="mb-1 text-sm text-gray-600">
                      <strong>Contacto:</strong> {req.email ?? "Sin contacto"}
                    </p>
                    <p className="mb-4 text-sm text-gray-600">
                      <strong>Creado:</strong>{" "}
                      {req.creado_en
                        ? new Date(req.creado_en).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Sin descripción"}
                    </p>
                  </div>

                  {/* Botones */}
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleDecision(String(req.id), "APROBADA")}
                      className="flex items-center px-4 py-2 text-white bg-[#FA8072] rounded shadow hover:bg-[#e87366]"
                    >
                      <FaCheckCircle className="mr-2" />
                      Aceptar
                    </button>
                    <button
                      onClick={() =>
                        handleDecision(String(req.id), "RECHAZADA")
                      }
                      className="flex items-center px-4 py-2 text-black bg-gray-300 rounded shadow hover:bg-gray-400"
                    >
                      <FaTimesCircle className="mr-2" />
                      Rechazar
                    </button>
                      <button
                      onClick={() =>
                           handleVerificacion(String(req.id))
                          
                      }
                      className="flex items-center px-4 py-2 text-black bg-gray-300 rounded shadow hover:bg-gray-400"
                    >
                      <FaTimesCircle className="mr-2" />
                      Ver Documentacion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

