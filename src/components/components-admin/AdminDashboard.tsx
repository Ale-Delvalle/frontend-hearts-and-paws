"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getTotalOrganizaciones, getVerificacion, Patchsolicitud } from "@/services/adminconexion";
import { OngUser } from "@/types/ong";
import Footer from "../Footer";



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
          <div className="space-y-6">
            {requests.map((req: OngUser) => (
              <div
                key={req.id}
                className="bg-white border border-[#6c2f00]/15 rounded-3xl p-6 md:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 font-body-editorial"
              >
                {/* Imagen de perfil */}
                <img
                  src={req.imagenPerfil || "https://ui-avatars.com/api/?name=ONG&background=FFC0CB&color=fff"}
                  alt={`Foto de perfil de ${req.nombre}`}
                  className="w-32 h-32 md:w-36 md:h-36 object-cover border-4 border-[#fff1ea] rounded-2xl shadow-xs shrink-0"
                />

                {/* Información textual y Botones */}
                <div className="flex-1 flex flex-col justify-between w-full">
                  <div>
                    <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] mb-2">
                      {req.nombre}
                    </h2>
                    
                    <div className="space-y-1 mb-4 text-sm text-[#54433a]">
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#6c2f00]">mail</span>
                        <span className="font-bold text-[#6c2f00]">Contacto:</span> {req.email ?? "Sin contacto registrado"}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#6c2f00]">calendar_month</span>
                        <span className="font-bold text-[#6c2f00]">Fecha de Registro:</span>{" "}
                        {req.creado_en
                          ? new Date(req.creado_en).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "No especificada"}
                      </p>
                    </div>
                  </div>

                  {/* Botonera de Acciones Editorial */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#6c2f00]/10">
                    <button
                      onClick={() => handleDecision(String(req.id), "APROBADA")}
                      className="bg-[#2e5d32] hover:bg-[#1b431e] text-white font-body-editorial text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      Aceptar
                    </button>
                    
                    <button
                      onClick={() => handleDecision(String(req.id), "RECHAZADA")}
                      className="bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-body-editorial text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>
                      Rechazar
                    </button>

                    <button
                      onClick={() => handleVerificacion(String(req.id))}
                      className="border border-[#6c2f00]/20 text-[#6c2f00] hover:bg-[#ffeade] font-body-editorial text-xs font-semibold px-5 py-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined text-base">description</span>
                      Ver Documentación
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

