"use client";

import { getTodasDonaciones } from "@/services/adminconexion";
import { useEffect, useState } from "react";

type Donacion = {
  id: string;
  monto: number;
  montoARS: number;
  estadoPago: string;
  fecha: string;
  usuario: {
    nombre: string;
    email: string;
  };
  organizacion: {
    nombre: string;
    email: string;
  };
  mascota: {
    nombre: string;
  };
  casoDonacion: {
    caso: {
      titulo: string;
    };
  };
};

export default function DonacionesRegistradas() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonaciones() {
      try {
        const res = await getTodasDonaciones();

        if (!res.ok) throw new Error("Error al cargar las donaciones");

        const data = await res.json();
        console.log("Donaciones:", data);
        setDonaciones(data);
      } catch (err) {
        setError("No se pudieron cargar las donaciones.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDonaciones();
  }, []);

  if (loading) return <p className="text-[#800000]">Cargando donaciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-pink-50 dark:bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-[#800000] mb-6">
        Donaciones Registradas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {donaciones.map((donacion) => (
          <div
            key={donacion.id}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-4 border border-pink-200 dark:border-zinc-700 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-[#800000] mb-2">
                {donacion.casoDonacion?.caso?.titulo || "Donación"}
              </h2>

              <p className="text-sm text-gray-700">
                💳 <strong>Monto:</strong> ${donacion.monto} USD /{" "}
                {donacion.montoARS} ARS
              </p>
              <p className="text-sm text-gray-700 mt-1">
                🧾 <strong>Estado:</strong>{" "}
                <span className="text-green-600 font-medium">
                  {donacion.estadoPago === "paid"
                    ? "Pagado"
                    : donacion.estadoPago}
                </span>
              </p>
              <p className="text-sm text-gray-700 mt-1">
                🐶 <strong>Mascota:</strong> {donacion.mascota?.nombre}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                🏠 <strong>Organización:</strong>{" "}
                {donacion.organizacion?.nombre}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                🙋‍♀️ <strong>Donante:</strong> {donacion.usuario?.nombre} (
                {donacion.usuario?.email})
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Fecha:{" "}
              {new Date(donacion.fecha).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
