"use client";

import { getTodosUser } from "@/services/adminconexion";
import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import { optimizarAvatar } from "@/utils/cloudinaryImage";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  imagenPerfil?: string | null;
  rol?: string;
  creado_en: number;
};

export function Vistausuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroPais, setFiltroPais] = useState<string>("Todos");
  const [filtroRol, setFiltroRol] = useState<string>("Todos");
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const obtenerUsuarios = async (nombre?: string, email?: string) => {
    try {
      const res = await getTodosUser({ nombre, email });

      if (!res || !res.ok) throw new Error("Error al obtener los usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    // Carga inicial sin filtros
    obtenerUsuarios();
  }, []);

  const handleBuscar = () => {
    obtenerUsuarios(filtroNombre, filtroEmail);
  };

  const paises = [
    "Todos",
    ...new Set(usuarios.map((u) => u.pais).filter(Boolean)),
  ];
  const roles = [
    "Todos",
    ...new Set(usuarios.map((u) => u.rol).filter(Boolean)),
  ];

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincidePais = filtroPais === "Todos" || usuario.pais === filtroPais;
    const coincideRol = filtroRol === "Todos" || usuario.rol === filtroRol;
    return coincidePais && coincideRol;
  });

  const abrirModal = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTimeout(() => setUsuarioSeleccionado(null), 300);
  };

  const getAvatarUrl = (nombre: string, imagenPerfil?: string | null, tamanio = 64) => {
    if (imagenPerfil) return optimizarAvatar(imagenPerfil, tamanio) as string;
    const encodedName = encodeURIComponent(nombre || "Usuario Anónimo");
    return `https://ui-avatars.com/api/?name=${encodedName}&background=FFC0CB&color=fff&bold=true`;
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial flex flex-col selection:bg-[#c85a32] selection:text-white">
      <div className="flex-grow max-w-[1280px] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Encabezado Hero Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff1ea] dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#6c2f00] dark:text-[#ffdbc9] font-body-editorial text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base">group</span>
            Gestión de Usuarios
          </div>
          <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl text-[#6c2f00] dark:text-[#ffdbc9] font-bold tracking-tight mb-4 leading-[1.1]">
            Usuarios Registrados
          </h1>
          <p className="font-body-editorial text-base sm:text-lg text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
            Explora, busca y examina en detalle la lista completa de usuarios registrados en el sistema.
          </p>
        </div>

        {/* Tarjeta de Total Registrados */}
        <div className="mb-10 flex justify-center">
          <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-2xl p-6 shadow-xs max-w-xs w-full text-center">
            <p className="font-body-editorial text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-lg text-[#6c2f00] dark:text-[#ffdbc9]">badge</span>
              Total Registrados
            </p>
            <p className="font-display-editorial text-4xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
              {usuarios.length}
            </p>
          </div>
        </div>

        {/* Panel de Filtros Editorial */}
        <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-2xl p-6 shadow-xs mb-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full sm:w-56 px-5 py-2.5 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#121214] text-[#6c2f00] dark:text-[#ffdbc9] placeholder:text-[#54433a]/60 dark:placeholder:text-[#dac2b6]/60 font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />

          <input
            type="text"
            placeholder="Buscar por email..."
            className="w-full sm:w-56 px-5 py-2.5 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#121214] text-[#6c2f00] dark:text-[#ffdbc9] placeholder:text-[#54433a]/60 dark:placeholder:text-[#dac2b6]/60 font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all"
            value={filtroEmail}
            onChange={(e) => setFiltroEmail(e.target.value)}
          />

          <select
            className="appearance-none w-full sm:w-auto px-5 py-2.5 pr-10 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#121214] text-[#6c2f00] dark:text-[#ffdbc9] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all cursor-pointer"
            value={filtroPais}
            onChange={(e) => setFiltroPais(e.target.value)}
          >
            {paises.map((pais) => (
              <option key={pais} value={pais} className="bg-[#fff8f5] dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9]">
                País: {pais}
              </option>
            ))}
          </select>

          <select
            className="appearance-none w-full sm:w-auto px-5 py-2.5 pr-10 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#121214] text-[#6c2f00] dark:text-[#ffdbc9] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all cursor-pointer"
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
          >
            {roles.map((rol) => (
              <option key={rol} value={rol} className="bg-[#fff8f5] dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9]">
                Rol: {rol}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={handleBuscar}
              className="bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial text-xs font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
            >
              <span className="material-symbols-outlined text-base">search</span>
              Buscar
            </button>

            <button
              onClick={() => {
                setFiltroNombre("");
                setFiltroEmail("");
                setFiltroPais("Todos");
                setFiltroRol("Todos");
                obtenerUsuarios();
              }}
              className="border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#ffeade] dark:hover:bg-[#26262e] font-body-editorial text-xs font-semibold px-6 py-2.5 rounded-full transition-all cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              Limpiar
            </button>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {usuariosFiltrados.map((user) => (
            <div
              key={user.id}
              onClick={() => abrirModal(user)}
              className="cursor-pointer bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group flex items-start gap-4"
            >
              <img
                src={getAvatarUrl(user.nombre, user.imagenPerfil, 64)}
                alt={user.nombre}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 group-hover:border-[#c85a32] transition-colors shrink-0 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display-editorial text-lg font-bold text-[#6c2f00] dark:text-[#ffdbc9] group-hover:text-[#c85a32] transition-colors truncate">
                  {user.nombre || "Usuario Anónimo"}
                </p>
                <p className="font-body-editorial text-xs text-[#54433a] dark:text-[#dac2b6] truncate mt-0.5">
                  {user.email}
                </p>
                <p className="font-body-editorial text-xs text-[#54433a]/80 dark:text-[#dac2b6]/80 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#6c2f00] dark:text-[#ffdbc9]">location_on</span>
                  {user.ciudad ? `${user.ciudad}, ` : ""}{user.pais || "País no especificado"}
                </p>
                {user.rol && (
                  <span className="inline-flex items-center gap-1 bg-[#fff1ea] dark:bg-[#26262e] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6c2f00] dark:bg-[#ffdbc9]" />
                    {user.rol}
                  </span>
                )}
              </div>
            </div>
          ))}

          {usuariosFiltrados.length === 0 && (
            <div className="p-12 text-center text-[#54433a] dark:text-[#dac2b6] bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-2xl shadow-xs col-span-full font-body-editorial text-sm font-semibold">
              No se encontraron usuarios que coincidan con los filtros aplicados.
            </div>
          )}
        </div>
      </div>

      {/* Modal Flotante Editorial */}
      {usuarioSeleccionado && (
        <div
          className={`fixed inset-0 bg-[#1c1c21]/60 dark:bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            mostrarModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={cerrarModal}
        >
          <div
            className={`bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-8 max-w-md w-full shadow-2xl relative font-body-editorial transform transition-all duration-300 ${
              mostrarModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-[#6c2f00] dark:text-[#ffdbc9] hover:text-[#c85a32] transition-colors p-2 rounded-full hover:bg-[#fff8f5] dark:hover:bg-[#26262e] cursor-pointer flex items-center justify-center"
              aria-label="Cerrar detalles"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <img
              src={getAvatarUrl(
                usuarioSeleccionado.nombre,
                usuarioSeleccionado.imagenPerfil,
                96
              )}
              alt={usuarioSeleccionado.nombre}
              className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[#fff1ea] dark:border-[#26262e] shadow-md mb-4"
            />

            <h3 className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] text-center mb-6">
              {usuarioSeleccionado.nombre || "Usuario Anónimo"}
            </h3>

            <div className="space-y-3 text-sm text-[#54433a] dark:text-[#dac2b6] bg-[#fff8f5] dark:bg-[#121214] p-5 rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#6c2f00] dark:text-[#ffdbc9]">mail</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9]">Email</p>
                  <p className="font-semibold text-[#1c1c21] dark:text-[#ffede4]">{usuarioSeleccionado.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#6c2f00] dark:text-[#ffdbc9]">public</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9]">Ubicación</p>
                  <p className="font-semibold text-[#1c1c21] dark:text-[#ffede4]">
                    {usuarioSeleccionado.ciudad ? `${usuarioSeleccionado.ciudad}, ` : ""}{usuarioSeleccionado.pais || "No especificado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#ffdbc9] text-lg">badge</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9]">Rol del Usuario</p>
                  <span className="bg-[#fff1ea] dark:bg-[#26262e] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-xs font-semibold px-3 py-0.5 rounded-full inline-block mt-0.5">
                    {usuarioSeleccionado.rol ?? "Sin rol asignado"}
                  </span>
                </div>
              </div>

              {usuarioSeleccionado.telefono && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-[#6c2f00] dark:text-[#ffdbc9]">call</span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9]">Teléfono</p>
                    <p className="font-semibold text-[#1c1c21] dark:text-[#ffede4]">{usuarioSeleccionado.telefono}</p>
                  </div>
                </div>
              )}

              {usuarioSeleccionado.direccion && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-[#6c2f00] dark:text-[#ffdbc9]">home</span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9]">Dirección</p>
                    <p className="font-semibold text-[#1c1c21] dark:text-[#ffede4]">{usuarioSeleccionado.direccion}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Vistausuario;
