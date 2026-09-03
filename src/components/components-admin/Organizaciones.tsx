"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getTodosOng,
  getTotalOrganizacionesAprobadas,
} from "@/services/adminconexion";

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

        {/* Tarjeta de Total Aprobadas */}
        <div className="mb-10 flex justify-center">
          <div className="bg-white border border-[#6c2f00]/15 rounded-2xl p-6 shadow-xs max-w-xs w-full text-center">
            <p className="font-body-editorial text-xs font-bold uppercase tracking-wider text-[#54433a] mb-1 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-lg text-[#6c2f00]">verified</span>
              Total Aprobadas
            </p>
            <p className="font-display-editorial text-4xl font-bold text-[#6c2f00]">
              {totalOrganizaciones}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white border border-[#6c2f00]/15 rounded-2xl p-5 shadow-xs sticky top-6 font-body-editorial">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-1">
              {organizaciones.map((org) => (
                <div
                  key={org.id}
                  onClick={() => setOrganizacionSeleccionada(org)}
                  className="cursor-pointer border border-[#ffece8] dark:border-transparent rounded-xl p-4 bg-white dark:bg-[#FA8072] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#fff5f2] dark:bg-[#e87366] rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                  <div className="flex items-center gap-3">
                    <img
                      src={org.imagenPerfil ?? "/default-profile.png"}
                      alt={`Foto de ${org.nombre}`}
                      className="w-16 h-16 object-cover border-4 border-[#ffece8] dark:border-[#e87366] rounded-full shadow-sm group-hover:border-[#ffcfc7] dark:group-hover:border-white transition-colors"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 dark:text-white truncate">{org.nombre}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-200 mb-1 truncate">{org.email}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#ffece8] dark:bg-white text-[#FA8072] dark:text-[#FA8072]">
                        {org.plan}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#e87366] flex items-center justify-between">
                    <p className="text-[11px] text-gray-400 dark:text-gray-200 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(org.creado_en).toLocaleDateString("es-AR")}
                    </p>
                    <p className="text-xs font-semibold text-[#FA8072] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Ver más
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>

      {organizacionSeleccionada && (
        <div className="fixed inset-0 bg-red-900 dark:bg-black bg-opacity-40 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#FA8072] p-5 rounded-xl w-full max-w-sm relative shadow-xl">
            <button
              onClick={() => setOrganizacionSeleccionada(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold text-[#FA8072] dark:text-white mb-2">
              {organizacionSeleccionada.nombre}
            </h2>
            <img
              src={organizacionSeleccionada.imagenPerfil ?? "/default-profile.png"}
              alt={`Foto de perfil de ${organizacionSeleccionada.nombre}`}
              className="w-32 h-32 object-cover border-4 border-[#ffcfc7] dark:border-white shadow-sm rounded-full mx-auto mb-3"
            />
            <p className="text-xs text-gray-700 dark:text-white mb-1">
              <strong>Email:</strong> {organizacionSeleccionada.email}
            </p>
            <p className="text-xs text-gray-700 dark:text-white mb-1">
              <strong>Plan:</strong> {organizacionSeleccionada.plan}
            </p>
            <p className="text-xs text-gray-700 dark:text-white">
              <strong>Creado en:</strong>{" "}
              {new Date(organizacionSeleccionada.creado_en).toLocaleDateString("es-AR")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
