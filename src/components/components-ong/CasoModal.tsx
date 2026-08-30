"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Caso } from "@/types/casos";
import Image from "next/image";
import { ESTADOS_MASCOTA, EstadoMascotaKey } from "@/lib/estadoMascota";
import { updateEstadoMascota } from "@/services/pet";

type CasoModalProps = {
  caso: Caso;
  visible: boolean;
  onClose: () => void;
};

export default function CasoModal({ caso, visible, onClose }: CasoModalProps) {
  const [estado, setEstado] = useState<EstadoMascotaKey>(caso.mascota.estado ?? "EN_ADOPCION");
  const [guardando, setGuardando] = useState(false);

  if (!visible) return null;

  const imagenUrl =
    caso.mascota.imagenes?.[0]?.url ?? "https://via.placeholder.com/400x300?text=Mascota";

  const handleCambiarEstado = async (nuevoEstado: EstadoMascotaKey) => {
    const anterior = estado;
    setEstado(nuevoEstado);
    setGuardando(true);
    try {
      await updateEstadoMascota(caso.mascota.id, nuevoEstado);
      toast.success(`Estado de ${caso.mascota.nombre} actualizado a "${ESTADOS_MASCOTA[nuevoEstado].label}"`);
    } catch {
      setEstado(anterior);
      toast.error("No se pudo actualizar el estado de la mascota.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#ffece8] bg-opacity-30"
      onClick={onClose}
    >
      <div
        className="relative bg-[#fff5f2] rounded-2xl shadow-lg max-w-md w-full p-6 border border-[#ffcfc7] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-[#FA8072] hover:text-[#FA8072] text-3xl font-bold z-10"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <div className="mb-4 flex justify-center">
          <Image
            src={imagenUrl}
            alt={caso.mascota.nombre}
            width={400}
            height={300}
            className="rounded-md object-cover"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-[#FA8072] mb-4 text-center">
          {caso.titulo}
        </h2>

        <div className="max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed text-gray-700 text-center mb-4">
          {caso.descripcion}
        </div>

        <div className="border-t border-[#ffcfc7] pt-4">
          <label htmlFor="estado-mascota" className="block text-sm font-semibold text-[#FA8072] mb-2 text-center">
            Estado de {caso.mascota.nombre}
          </label>
          <select
            id="estado-mascota"
            value={estado}
            disabled={guardando}
            onChange={(e) => handleCambiarEstado(e.target.value as EstadoMascotaKey)}
            className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-full shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FA8072] disabled:opacity-50"
          >
            {Object.entries(ESTADOS_MASCOTA).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
