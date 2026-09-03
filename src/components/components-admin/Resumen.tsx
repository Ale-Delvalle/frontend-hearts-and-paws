"use client";

import { useEffect, useState } from "react";
import {
  getTotalMascotas,
  getTotalDonaciones,
  getTotalAdopcionesAceptadas,
  getTodosUser,
  getTotalOrganizacionesAprobadas,
  getTodosOng,
} from "../../services/adminconexion";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  pais: string;
  rol: string;
  externalId: string | null;
};

type ONG = {
  id: string;
  nombre: string;
  email: string;
  pais: string;
};

export default function DashboardResumen() {
  const [stats, setStats] = useState({
    organizations: 0,
    pets: 0,
    donations: 0,
    adoptions: 0,
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [orgs, setOrgs] = useState<ONG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          organizationsCount,
          pets,
          donations,
          adoptions,
          usuariosRes,
          ultimasOrganizaciones,
        ] = await Promise.all([
          getTotalOrganizacionesAprobadas(),
          getTotalMascotas(),
          getTotalDonaciones(),
          getTotalAdopcionesAceptadas(),
          getTodosUser(),
          getTodosOng(),
        ]);

        let usuariosData: Usuario[] = [];
        if (usuariosRes) {
          usuariosData = await usuariosRes.json();
        }

        let organizacion: ONG[] = [];
        if (ultimasOrganizaciones) {
          organizacion = await ultimasOrganizaciones.json();
          console.log("Datos de organizaciones:", organizacion);
        }

        const organizaciones = organizacion.filter(
          (o: ONG) => o.nombre.toLowerCase() !== ""
        );

        const usuariosActivos = usuariosData.filter(
          (u: Usuario) => u.rol?.toLowerCase() === "usuario"
        );

        setStats({
          organizations: organizationsCount,
          pets,
          donations,
          adoptions,
        });
        setUsuarios(usuariosActivos.slice(0, 6));

        setOrgs(organizaciones.slice(0, 6));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos del resumen");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center p-6 font-body-editorial">
        <div className="flex flex-col items-center gap-3 text-[#6c2f00]">
          <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
          <p className="font-semibold text-sm">Cargando datos del panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center p-6 font-body-editorial">
        <div className="bg-white border border-[#ae2f34]/20 p-8 rounded-2xl shadow-xs max-w-md text-center">
          <span className="material-symbols-outlined text-[#ae2f34] text-4xl mb-2">error</span>
          <h3 className="font-display-editorial text-xl font-bold text-[#6c2f00] mb-2">Error de Carga</h3>
          <p className="text-[#54433a] text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-semibold text-xs py-2.5 px-5 rounded-full transition-all cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#28180d] font-body-editorial flex flex-col selection:bg-[#ff6b6b] selection:text-white">
      <div className="flex-grow max-w-[1280px] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Encabezado Hero Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff1ea] border border-[#6c2f00]/15 text-[#6c2f00] font-body-editorial text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base">dashboard</span>
            Panel de Administración
          </div>
          <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl text-[#6c2f00] font-bold tracking-tight mb-4 leading-[1.1]">
            Resumen del Sistema
          </h1>
          <p className="font-body-editorial text-base sm:text-lg text-[#54433a] leading-relaxed">
            Visualiza las métricas clave, organizaciones asociadas y la actividad reciente de los usuarios registrados en Hearts&amp;Paws.
          </p>
        </div>

        {/* Tarjetas de Métricas Editorial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <ResumenCard
            title="Organizaciones Aprobadas"
            value={stats.organizations}
            iconName="domain"
          />
          <ResumenCard
            title="Mascotas Registradas"
            value={stats.pets}
            iconName="pets"
          />
          <ResumenCard
            title="Adopciones Completadas"
            value={stats.adoptions}
            iconName="volunteer_activism"
          />
          <ResumenCard
            title="Donaciones Totales"
            value={`$${stats.donations}`}
            iconName="payments"
          />
        </div>

        {/* Tabla de Organizaciones */}
        <div className="mb-12">
          <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#6c2f00]">corporate_fare</span>
            Últimas Organizaciones Registradas
          </h2>
          <TablaSimple data={orgs} />
        </div>

        {/* Tabla de Usuarios */}
        <div className="mb-12">
          <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#6c2f00]">group</span>
            Últimos Usuarios Registrados
          </h2>
          <TablaSimple data={usuarios} />
        </div>
      </div>
    </div>
  );
}

type ResumenCardProps = {
  title: string;
  value: string | number;
  iconName?: string;
};

function ResumenCard({ title, value, iconName }: ResumenCardProps) {
  return (
    <div className="bg-white border border-[#6c2f00]/15 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-body-editorial text-xs font-bold uppercase tracking-wider text-[#54433a]">
          {title}
        </h4>
        {iconName && (
          <span className="material-symbols-outlined text-[#6c2f00] text-2xl group-hover:scale-110 transition-transform">
            {iconName}
          </span>
        )}
      </div>
      <p className="font-display-editorial text-3xl sm:text-4xl font-bold text-[#6c2f00]">
        {value}
      </p>
    </div>
  );
}

type TablaSimpleProps = {
  data: (Usuario | ONG)[];
};

function TablaSimple({ data }: TablaSimpleProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-300 bg-white dark:bg-zinc-900 border border-[#ffcfc7] dark:border-zinc-700 rounded-lg shadow">
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-900 border border-[#ffcfc7] dark:border-zinc-700 rounded-lg shadow">
      <table className="min-w-full divide-y divide-pink-200 dark:divide-zinc-700">
        <thead className="bg-[#ffece8] dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#FA8072] uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#FA8072] uppercase tracking-wider">
              Email
            </th>
            {"rol" in data[0] && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#FA8072] uppercase tracking-wider">
                País
              </th>
            )}
            {"rol" in data[0] && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#FA8072] uppercase tracking-wider">
                Origen
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-pink-100 dark:divide-zinc-700">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-sm text-gray-800">{item.nombre}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{item.email}</td>
              {"rol" in item && (
                <td className="px-4 py-3 text-sm text-gray-600">{item.pais}</td>
              )}
              {"rol" in item && (
                <td className="px-4 py-3 text-sm">
                  {item.externalId ? (
                    <span className="text-green-600 font-medium">Supabase</span>
                  ) : (
                    <span className="text-blue-600 font-medium">Local</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
