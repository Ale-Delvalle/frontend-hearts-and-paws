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
    <div className="min-h-screen bg-pink-50 dark:bg-black pb-10">
      {/* Tarjeta total centrada arriba */}
      <div className="pt-6 pb-4 px-5">
        <div className="flex justify-center">
          <div className="bg-white dark:bg-[#0a0a0a] shadow-sm rounded-xl p-5 w-52 border border-red-100 dark:border-[#1f1f1f] text-center hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Aprobadas</p>
            <p className="text-4xl font-extrabold text-[#800000] dark:text-white">{totalOrganizaciones}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 px-6 max-w-6xl mx-auto">
        {/* Sidebar / Nav - A la misma altura que el título */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-red-100 dark:border-[#333333] overflow-hidden sticky top-6">
            <div className="bg-[#c81e1e] dark:bg-[#141414] dark:border-b dark:border-[#333333] px-5 py-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Panel ONG
              </h2>
            </div>
            <div className="p-2">
              <button
                onClick={() => router.push("/dashboard/admin/ong-rechazadas")}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg hover:bg-red-50 dark:hover:bg-[#262626] hover:text-[#800000] dark:hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-[#800000] dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Rechazadas</span>
                </div>
                <svg className="w-3 h-3 text-gray-400 group-hover:text-[#800000] dark:group-hover:text-white transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#800000] dark:text-white tracking-tight">
              Organizaciones Registradas
            </h1>

            {/* Filtros */}
            <div className="flex flex-wrap gap-3 bg-white dark:bg-[#0a0a0a] p-3 rounded-xl shadow-sm border border-red-100 dark:border-[#1f1f1f]">
              <input
                type="text"
                placeholder="Filtrar por nombre"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                className="flex-1 min-w-[160px] text-sm border border-gray-200 dark:border-[#333333] bg-gray-50 dark:bg-[#141414] dark:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
              />

              <input
                type="text"
                placeholder="Filtrar por plan"
                value={filtroPlan}
                onChange={(e) => setFiltroPlan(e.target.value)}
                className="flex-1 min-w-[160px] text-sm border border-gray-200 dark:border-[#333333] bg-gray-50 dark:bg-[#141414] dark:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
              />

              <button
                onClick={handleBuscar}
                className="bg-[#c81e1e] text-white text-sm px-5 py-2 rounded-lg font-semibold shadow-sm hover:bg-[#a11818] hover:shadow-md transition-all active:scale-95"
              >
                Buscar
              </button>

              <button
                onClick={handleLimpiar}
                className="bg-gray-100 dark:bg-[#1f1f1f] text-gray-700 dark:text-gray-300 text-sm px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-[#262626] transition-all active:scale-95"
              >
                Limpiar
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-1">
              {organizaciones.map((org) => (
                <div
                  key={org.id}
                  onClick={() => setOrganizacionSeleccionada(org)}
                  className="cursor-pointer border border-red-100 dark:border-[#1f1f1f] rounded-xl p-4 bg-white dark:bg-[#0a0a0a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-pink-50 dark:bg-[#141414] rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                  <div className="flex items-center gap-3">
                    <img
                      src={org.imagenPerfil ?? "/default-profile.png"}
                      alt={`Foto de ${org.nombre}`}
                      className="w-16 h-16 object-cover border-4 border-red-100 dark:border-[#1f1f1f] rounded-full shadow-sm group-hover:border-red-200 dark:group-hover:border-[#333333] transition-colors"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 dark:text-white truncate">{org.nombre}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">{org.email}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 dark:bg-[#333333] text-[#800000] dark:text-white">
                        {org.plan}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#1f1f1f] flex items-center justify-between">
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(org.creado_en).toLocaleDateString("es-AR")}
                    </p>
                    <p className="text-xs font-semibold text-[#800000] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
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

      {organizacionSeleccionada && (
        <div className="fixed inset-0 bg-red-900 dark:bg-black bg-opacity-40 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-xl w-full max-w-sm relative border dark:border-[#1f1f1f]">
            <button
              onClick={() => setOrganizacionSeleccionada(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold text-[#800000] dark:text-white mb-2">
              {organizacionSeleccionada.nombre}
            </h2>
            <img
              src={organizacionSeleccionada.imagenPerfil ?? "/default-profile.png"}
              alt={`Foto de perfil de ${organizacionSeleccionada.nombre}`}
              className="w-32 h-32 object-cover border-4 border-red-200 dark:border-[#1f1f1f] shadow-sm rounded-full mx-auto mb-3"
            />
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
              <strong>Email:</strong> {organizacionSeleccionada.email}
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
              <strong>Plan:</strong> {organizacionSeleccionada.plan}
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <strong>Creado en:</strong>{" "}
              {new Date(organizacionSeleccionada.creado_en).toLocaleDateString("es-AR")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
