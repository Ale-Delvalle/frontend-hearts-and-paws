"use client";

import { getCasosDonacion } from "@/services/adminconexion";
import { useEffect, useState } from "react";

type CasoDonacion = {
  id: string;
  titulo: string;
  descripcion: string;
  creado_en: string;
  mascota: {
    nombre: string;
    edad: number;
    imagenes: { url: string }[];
  };
  ong: {
    nombre: string;
  };
  donacion: {
    estadoDonacion: number;
    metaDonacion: number;
  } | null;
};

export default function DonacionesRegistradas() {
  const [casosConIngreso, setCasosConIngreso] = useState<CasoDonacion[]>([]);
  const [casosSinIngreso, setCasosSinIngreso] = useState<CasoDonacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCasosDonacion() {
      try {
        const res = await getCasosDonacion();

        if (!res || !res.ok) throw new Error("Error al cargar los casos de donación");

        const data: CasoDonacion[] = await res.json();
        console.log("Casos de Donación:", data);

        const conIngreso = data.filter((caso) => (caso.donacion?.estadoDonacion || 0) > 0);
        const sinIngreso = data.filter((caso) => (caso.donacion?.estadoDonacion || 0) === 0);

        setCasosConIngreso(conIngreso);
        setCasosSinIngreso(sinIngreso);
      } catch (err) {
        setError("No se pudieron cargar los casos activos de donación.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCasosDonacion();
  }, []);

  if (loading) return <p className="text-[#FA8072] p-6">Cargando datos...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  const renderCasoCard = (caso: CasoDonacion) => (
    <div
      key={caso.id}
      className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 border border-[#ffcfc7] dark:border-zinc-700 flex flex-col mb-4 transition hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <img
          src={caso.mascota?.imagenes?.[0]?.url || "/default-pet.jpg"}
          alt={caso.mascota?.nombre || "Mascota"}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded shadow-sm"
        />
        <div className="flex-1">
          <h2 className="text-md font-bold text-[#FA8072] line-clamp-2 leading-tight mb-1">
            {caso.titulo}
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
            {caso.descripcion}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              🐾 <strong>Mascota:</strong> {caso.mascota?.nombre} ({caso.mascota?.edad} años)
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              🏠 <strong>ONG:</strong> {caso.ong?.nombre || "Desconocida"}
            </p>
            {caso.donacion && (
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                💰 Recaudado: ${caso.donacion.estadoDonacion} / ${caso.donacion.metaDonacion}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-pink-100 dark:border-zinc-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
          {new Date(caso.creado_en).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-[#fff5f2] dark:bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-[#FA8072] mb-8 text-center">
        Panel de Donaciones
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna 1: Con Ingresos */}
        <div className="border-2 border-green-200 dark:border-green-800 bg-white/50 dark:bg-zinc-900/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-500 mb-6 flex items-center gap-2">
            ✅ Donaciones con ingresos registrados
          </h2>
          {casosConIngreso.length === 0 ? (
            <p className="text-gray-500 italic">No hay casos con ingresos todavía.</p>
          ) : (
            <div className="flex flex-col">
              {casosConIngreso.map(renderCasoCard)}
            </div>
          )}
        </div>

        {/* Columna 2: Sin Ingresos */}
        <div className="border-2 border-orange-200 dark:border-orange-800 bg-white/50 dark:bg-zinc-900/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-orange-600 dark:text-orange-500 mb-6 flex items-center gap-2">
            ⏳ Recaudaciones aún sin ingresos
          </h2>
          {casosSinIngreso.length === 0 ? (
            <p className="text-gray-500 italic">No hay recaudaciones sin ingresos.</p>
          ) : (
            <div className="flex flex-col">
              {casosSinIngreso.map(renderCasoCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
