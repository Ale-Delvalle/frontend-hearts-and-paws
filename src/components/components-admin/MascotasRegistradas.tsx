"use client";

import { fetchMascotasObtenidas } from "@/services/adminconexion";
import { useEffect, useState } from "react";

type ImagenMascota = {
  id: string;
  url: string;
  mascotaId: string;
  subida_en: string;
};

type Mascota = {
  id: string;
  nombre: string;
  edad: number;
  descripcion: string;
  creada_en: string;
  organizacionId: string;
  tipoId: string;
  imagenes: ImagenMascota[];
};

export default function MascotasRegistradas() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);


  useEffect(() => {
    async function fetchMascotas() {
      try {
        const res = await fetchMascotasObtenidas();
        if (!res || !res.ok) throw new Error("Error al obtener las Mascotas");
        const data = await res.json();
        setMascotas(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar las mascotas.");
      } finally {
        setLoading(false);
      }
    }

    fetchMascotas();
  }, []);

  if (loading) return <p className="text-[#FA8072]">Cargando mascotas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
  <div className="p-6 bg-[#fff5f2] dark:bg-black min-h-screen">
    <h1 className="text-3xl font-bold text-[#FA8072] mb-6">
      Mascotas Registradas
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {mascotas.map((mascota) => (
        <div
          key={mascota.id}
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col"
        >
          <div className="w-full h-48 p-2 flex items-center justify-center bg-white dark:bg-zinc-900">
            <img
              src={mascota.imagenes[0]?.url || "/default-pet.jpg"}
              alt={`Foto de ${mascota.nombre}`}
              width={180}
              height={130}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-[#FA8072]">
              {mascota.nombre}
            </h2>
            <p className="text-sm text-gray-700">Edad: {mascota.edad} años</p>

            <button
              onClick={() => setMascotaSeleccionada(mascota)}
              className="mt-2 text-sm text-[#FA8072] underline hover:text-[#FA8072] rounded-full"
            >
              Conocer historia
            </button>

            <p className="text-xs text-gray-500 mt-4">
              Registrado el{" "}
              {new Date(mascota.creada_en).toLocaleDateString("es-AR")}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Modal */}
    {mascotaSeleccionada && (
      <div className="fixed inset-0 bg-pink-300 dark:bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full relative shadow-lg">
          <button
            onClick={() => setMascotaSeleccionada(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
          <h2 className="text-xl font-bold text-[#FA8072] mb-2">
            {mascotaSeleccionada.nombre}
          </h2>
          <img
            src={mascotaSeleccionada.imagenes[0]?.url || "/default-pet.jpg"}
            alt={`Foto de ${mascotaSeleccionada.nombre}`}
            className="w-full h-48 object-contain mb-4"
          />
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {mascotaSeleccionada.descripcion}
          </p>
        </div>
      </div>
    )}
  </div>
);


}
