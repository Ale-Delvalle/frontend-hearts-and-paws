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
    <main className="min-h-screen p-8 bg-[#ffece8] dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
    
          </div>
        </header>

        <h1 className="flex items-center mb-6 text-3xl font-bold text-[#FA8072]">
          <MdVerified className="mr-2 text-[#FA8072]" />
          Solicitudes de Verificación de ONGs
        </h1>

        {loading ? (
          <div className="font-semibold text-center text-[#FA8072]">
            Cargando solicitudes...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-6 text-center text-gray-600 dark:text-gray-300 bg-white dark:bg-zinc-900 rounded-lg shadow">
            No hay solicitudes pendientes.
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
    </main>
  );
}

