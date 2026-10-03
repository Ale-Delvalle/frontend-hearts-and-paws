"use client";
import React from "react";
import { useOngAuth } from "@/context/OngAuthContext";
import { optimizarAvatar } from "@/utils/cloudinaryImage";

const ProfileOng = () => {
  const { ong } = useOngAuth();

  if (!ong) {
    return (
      <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-12 text-center shadow-xs">
        <span className="material-symbols-outlined text-5xl text-[#6c2f00]/40 dark:text-[#ffdbc9]/40 mb-3">domain</span>
        <h3 className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-2">No hay datos de la ONG cargados</h3>
        <p className="text-sm text-[#54433a] dark:text-[#dac2b6]">Inicia sesión con una cuenta de organización para visualizar tu perfil.</p>
      </div>
    );
  }

  const avatarUrl =
    optimizarAvatar(ong.imagenPerfil, 112) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(ong.nombre || "ONG")}&background=FFC0CB&color=fff`;

  return (
    <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-6 sm:p-8 shadow-xs font-body-editorial transition-colors">
      {/* Encabezado */}
      <div className="mb-6 pb-6 border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fff1ea] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold mb-3">
          <span className="material-symbols-outlined text-base text-[#c85a32]">verified</span>
          Organización Registrada
        </div>
        <h1 className="font-display-editorial text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
          Perfil de la ONG
        </h1>
        <p className="text-sm text-[#54433a] dark:text-[#dac2b6] mt-1">
          Información general y datos de contacto de tu organización visibles en Hearts&amp;Paws.
        </p>
      </div>

      {/* Tarjeta de Identidad (Avatar + Nombre + Plan) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-[#fff8f5] dark:bg-[#121214] rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 mb-6">
        <img
          src={avatarUrl}
          alt={`Foto de perfil de ${ong.nombre}`}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-sm shrink-0"
        />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] truncate">
            {ong.nombre}
          </h2>
          {ong.email && (
            <p className="text-xs text-[#54433a] dark:text-[#dac2b6] truncate mt-1 flex items-center justify-center sm:justify-start gap-1">
              <span className="material-symbols-outlined text-sm text-[#6c2f00] dark:text-[#ffdbc9]">mail</span>
              {ong.email}
            </p>
          )}
          {ong.plan && (
            <span className="inline-flex items-center gap-1.5 bg-[#fff1ea] dark:bg-[#26262e] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-xs font-semibold px-3 py-1 rounded-full mt-3">
              <span className="material-symbols-outlined text-sm text-[#c85a32]">workspace_premium</span>
              Plan: {ong.plan}
            </span>
          )}
        </div>
      </div>

      {/* Descripción de la ONG */}
      {ong.descripcion && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9] mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#c85a32]">description</span>
            Sobre la organización
          </h3>
          <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] leading-relaxed bg-[#fff8f5] dark:bg-[#121214] p-4 rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 whitespace-pre-line">
            {ong.descripcion}
          </p>
        </div>
      )}

      {/* Datos de Contacto y Ubicación */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9] mb-3 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-[#c85a32]">contact_phone</span>
          Contacto y Ubicación
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3 p-3.5 bg-[#fff8f5] dark:bg-[#121214] rounded-xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
            <span className="material-symbols-outlined text-base text-[#6c2f00] dark:text-[#ffdbc9]">call</span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-[#6c2f00] dark:text-[#ffdbc9]">Teléfono</p>
              <p className="font-semibold text-[#1c1c21] dark:text-[#ffede4] truncate">{ong.telefono || "No especificado"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-[#fff8f5] dark:bg-[#121214] rounded-xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
            <span className="material-symbols-outlined text-base text-[#6c2f00] dark:text-[#ffdbc9]">home</span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-[#6c2f00] dark:text-[#ffdbc9]">Dirección</p>
              <p className="font-semibold text-[#1c1c21] dark:text-[#ffede4] truncate">{ong.direccion || "No especificada"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-[#fff8f5] dark:bg-[#121214] rounded-xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
            <span className="material-symbols-outlined text-base text-[#6c2f00] dark:text-[#ffdbc9]">location_city</span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-[#6c2f00] dark:text-[#ffdbc9]">Ciudad</p>
              <p className="font-semibold text-[#1c1c21] dark:text-[#ffede4] truncate">{ong.ciudad || "No especificada"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-[#fff8f5] dark:bg-[#121214] rounded-xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
            <span className="material-symbols-outlined text-base text-[#6c2f00] dark:text-[#ffdbc9]">public</span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-[#6c2f00] dark:text-[#ffdbc9]">País</p>
              <p className="font-semibold text-[#1c1c21] dark:text-[#ffede4] truncate">{ong.pais || "No especificado"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOng;