"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getTodosOng,
  getTotalOrganizacionesAprobadas,
} from "@/services/adminconexion";
import Footer from "../Footer";

interface Organizacion {
  id: string;
  nombre: string;
  email: string;
  imagenPerfil: string | null;
  plan: string;
  creado_en: Date;
}

export default function OrganizacionesPanel() {
  const router = useRouter();
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [organizacionSeleccionada, setOrganizacionSeleccionada] = useState<Organizacion | null>(null);
  const [totalOrganizaciones, setTotalOrganizaciones] = useState<number>(0);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("");

  const obtenerDatos = async (nombre?: string, plan?: string) => {
    try {
      const resOng = await getTodosOng({ nombre, plan });
      if (!resOng) return;
      const data = await resOng.json();
      setOrganizaciones(data);

      const total = await getTotalOrganizacionesAprobadas();
      setTotalOrganizaciones(total);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const handleBuscar = () => {
    obtenerDatos(filtroNombre, filtroPlan);
  };

  const handleLimpiar = () => {
    setFiltroNombre("");
    setFiltroPlan("");
    obtenerDatos();
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#28180d] font-body-editorial flex flex-col selection:bg-[#ff6b6b] selection:text-white">
      <div className="flex-grow max-w-[1280px] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Encabezado Hero Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff1ea] border border-[#6c2f00]/15 text-[#6c2f00] font-body-editorial text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base">corporate_fare</span>
            Directorio de ONGs
          </div>
          <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl text-[#6c2f00] font-bold tracking-tight mb-4 leading-[1.1]">
            Organizaciones Aprobadas
          </h1>
          <p className="font-body-editorial text-base sm:text-lg text-[#54433a] leading-relaxed">
            Consulta la lista de organizaciones activas en Hearts&amp;Paws, gestiona sus planes y filtra rápidamente sus datos.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <aside className="w-full md:w-64 shrink-0 space-y-4 sticky top-6 font-body-editorial">
            <div className="bg-white border border-[#6c2f00]/15 rounded-2xl p-5 shadow-xs">
              <h2 className="font-display-editorial text-lg font-bold text-[#6c2f00] mb-4 flex items-center gap-2 pb-3 border-b border-[#6c2f00]/10">
                <span className="material-symbols-outlined text-xl text-[#6c2f00]">domain</span>
                Navegación ONG
              </h2>
              <button
                onClick={() => router.push("/dashboard/admin/ong-rechazadas")}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#54433a] hover:text-[#6c2f00] bg-[#fff8f5] hover:bg-[#fff1ea] border border-[#6c2f00]/15 rounded-full transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#ff6b6b]">cancel</span>
                  <span>Ver Rechazadas</span>
                </div>
                <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">chevron_right</span>
              </button>
            </div>

            {/* Tarjeta de Total Aprobadas */}
            <div className="bg-white border border-[#6c2f00]/15 rounded-2xl p-5 shadow-xs text-center">
              <p className="font-body-editorial text-xs font-bold uppercase tracking-wider text-[#54433a] mb-1 flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-lg text-[#6c2f00]">verified</span>
                Total Aprobadas
              </p>
              <p className="font-display-editorial text-3xl font-bold text-[#6c2f00]">
                {totalOrganizaciones}
              </p>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="flex-1 min-w-0 w-full">
            <div className="flex flex-col gap-6">
              {/* Panel de Filtros */}
              <div className="bg-white border border-[#6c2f00]/15 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Filtrar por nombre..."
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                  className="w-full sm:w-52 px-5 py-2 border border-[#6c2f00]/20 bg-[#fff8f5] text-[#6c2f00] placeholder:text-[#54433a]/60 font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all"
                />

                <input
                  type="text"
                  placeholder="Filtrar por plan..."
                  value={filtroPlan}
                  onChange={(e) => setFiltroPlan(e.target.value)}
                  className="w-full sm:w-52 px-5 py-2 border border-[#6c2f00]/20 bg-[#fff8f5] text-[#6c2f00] placeholder:text-[#54433a]/60 font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all"
                />

                <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
                  <button
                    onClick={handleBuscar}
                    className="bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-body-editorial text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
                  >
                    <span className="material-symbols-outlined text-base">search</span>
                    Buscar
                  </button>

                  <button
                    onClick={handleLimpiar}
                    className="border border-[#6c2f00]/20 text-[#6c2f00] hover:bg-[#ffeade] font-body-editorial text-xs font-semibold px-5 py-2.5 rounded-full transition-all cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">restart_alt</span>
                    Limpiar
                  </button>
                </div>
              </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {organizaciones.map((org) => (
                <div
                  key={org.id}
                  onClick={() => setOrganizacionSeleccionada(org)}
                  className="bg-white border border-[#6c2f00]/15 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={org.imagenPerfil || "https://ui-avatars.com/api/?name=ONG&background=FFC0CB&color=fff"}
                      alt={`Foto de ${org.nombre}`}
                      className="w-16 h-16 object-cover border-2 border-[#6c2f00]/15 group-hover:border-[#ff6b6b] rounded-full shadow-xs transition-colors shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display-editorial text-lg font-bold text-[#6c2f00] group-hover:text-[#ff6b6b] transition-colors truncate">
                        {org.nombre}
                      </h3>
                      <p className="font-body-editorial text-xs text-[#54433a] truncate mt-0.5">
                        {org.email}
                      </p>
                      <span className="inline-flex items-center gap-1 bg-[#fff1ea] text-[#6c2f00] border border-[#6c2f00]/15 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-2">
                        <span className="material-symbols-outlined text-xs">workspace_premium</span>
                        {org.plan}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#6c2f00]/10 flex items-center justify-between font-body-editorial text-xs text-[#54433a]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#6c2f00]">calendar_month</span>
                      {new Date(org.creado_en).toLocaleDateString("es-AR")}
                    </span>
                    <span className="font-semibold text-[#6c2f00] group-hover:text-[#ff6b6b] transition-colors flex items-center gap-0.5">
                      Ver más
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>

      {/* Modal Flotante de Detalle */}
      {organizacionSeleccionada && (
        <div className="fixed inset-0 bg-[#28180d]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white border border-[#6c2f00]/15 rounded-3xl p-8 max-w-md w-full shadow-2xl relative font-body-editorial">
            <button
              onClick={() => setOrganizacionSeleccionada(null)}
              className="absolute top-4 right-4 text-[#6c2f00] hover:text-[#ff6b6b] transition-colors p-2 rounded-full hover:bg-[#fff8f5] cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <img
              src={organizacionSeleccionada.imagenPerfil || "https://ui-avatars.com/api/?name=ONG&background=FFC0CB&color=fff"}
              alt={`Foto de perfil de ${organizacionSeleccionada.nombre}`}
              className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[#fff1ea] shadow-md mb-4"
            />

            <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] text-center mb-6">
              {organizacionSeleccionada.nombre}
            </h2>

            <div className="space-y-3 text-sm text-[#54433a] bg-[#fff8f5] p-5 rounded-2xl border border-[#6c2f00]/10">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#6c2f00]">mail</span>
                <strong className="text-[#6c2f00]">Email:</strong> {organizacionSeleccionada.email}
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#6c2f00]">workspace_premium</span>
                <strong className="text-[#6c2f00]">Plan:</strong> {organizacionSeleccionada.plan}
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#6c2f00]">calendar_month</span>
                <strong className="text-[#6c2f00]">Fecha de Registro:</strong>{" "}
                {new Date(organizacionSeleccionada.creado_en).toLocaleDateString("es-AR")}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
