"use client";
import React from "react";
import { useOngAuth } from "@/context/OngAuthContext";

const ProfileOng = () => {
  const { ong } = useOngAuth();

  if (!ong) {
    return (
      <div className="text-center text-gray-500">
        No hay datos de la ONG cargados.
      </div>
    );
  }

  return (
    <div className="text-gray-800 dark:text-white">
      <h2 className="text-[27px] font-bold mb-6 text-[#800000] dark:text-[#c81e1e]">Perfil de la ONG</h2>

      <div className="space-y-4 text-base">
        <p><span className="font-semibold">Nombre:</span> {ong.nombre}</p>
        <p><span className="font-semibold">Descripción:</span> {ong.descripcion}</p>
        <p><span className="font-semibold">Teléfono:</span> {ong.telefono}</p>
        <p><span className="font-semibold">Dirección:</span> {ong.direccion}</p>
        <p><span className="font-semibold">Ciudad:</span> {ong.ciudad}</p>
        <p><span className="font-semibold">País:</span> {ong.pais}</p>
      </div>

      {ong.imagenPerfil && (
        <div className="mt-6">
          <img
            src={ong.imagenPerfil}
            alt={`Foto de perfil de ${ong.nombre}`}
            className="w-48 h-48 object-cover rounded-full border-4 border-pink-500 shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileOng;