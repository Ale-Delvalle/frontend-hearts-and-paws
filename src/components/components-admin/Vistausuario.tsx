"use client";

import { getTodosUser } from "@/services/adminconexion";
import React, { useEffect, useState } from "react";
import Footer from "../Footer";

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

  const getAvatarUrl = (nombre: string, imagenPerfil?: string | null) => {
    if (imagenPerfil) return imagenPerfil;
    const encodedName = encodeURIComponent(nombre || "Usuario Anónimo");
    return `https://ui-avatars.com/api/?name=${encodedName}&background=FFC0CB&color=fff&bold=true`;
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#28180d] font-body-editorial flex flex-col selection:bg-[#ff6b6b] selection:text-white">
      <div className="flex-grow max-w-[1280px] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Encabezado Hero Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff1ea] border border-[#6c2f00]/15 text-[#6c2f00] font-body-editorial text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base">group</span>
            Gestión de Usuarios
          </div>
          <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl text-[#6c2f00] font-bold tracking-tight mb-4 leading-[1.1]">
            Usuarios Registrados
          </h1>
          <p className="font-body-editorial text-base sm:text-lg text-[#54433a] leading-relaxed">
            Explora, busca y examina en detalle la lista completa de usuarios registrados en el sistema.
          </p>
        </div>

        {/* Tarjeta de Total Registrados */}
        <div className="mb-10 flex justify-center">
          <div className="bg-white border border-[#6c2f00]/15 rounded-2xl p-6 shadow-xs max-w-xs w-full text-center">
            <p className="font-body-editorial text-xs font-bold uppercase tracking-wider text-[#54433a] mb-1 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-lg text-[#6c2f00]">badge</span>
              Total Registrados
            </p>
            <p className="font-display-editorial text-4xl font-bold text-[#6c2f00]">
              {usuarios.length}
            </p>
          </div>
        </div>

        {/* Panel de Filtros Editorial */}
        <div className="bg-white border border-[#6c2f00]/15 rounded-2xl p-6 shadow-xs mb-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full sm:w-56 px-5 py-2.5 border border-[#6c2f00]/20 bg-[#fff8f5] text-[#6c2f00] placeholder:text-[#54433a]/60 font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />

          <input
            type="text"
            placeholder="Buscar por email..."
            className="w-full sm:w-56 px-5 py-2.5 border border-[#6c2f00]/20 bg-[#fff8f5] text-[#6c2f00] placeholder:text-[#54433a]/60 font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all"
            value={filtroEmail}
            onChange={(e) => setFiltroEmail(e.target.value)}
          />

          <select
            className="appearance-none w-full sm:w-auto px-5 py-2.5 pr-10 border border-[#6c2f00]/20 bg-[#fff8f5] text-[#6c2f00] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all cursor-pointer"
            value={filtroPais}
            onChange={(e) => setFiltroPais(e.target.value)}
          >
            {paises.map((pais) => (
              <option key={pais} value={pais}>
                País: {pais}
              </option>
            ))}
          </select>

          <select
            className="appearance-none w-full sm:w-auto px-5 py-2.5 pr-10 border border-[#6c2f00]/20 bg-[#fff8f5] text-[#6c2f00] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all cursor-pointer"
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
          >
            {roles.map((rol) => (
              <option key={rol} value={rol}>
                Rol: {rol}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={handleBuscar}
              className="bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-body-editorial text-xs font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
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
              className="border border-[#6c2f00]/20 text-[#6c2f00] hover:bg-[#ffeade] font-body-editorial text-xs font-semibold px-6 py-2.5 rounded-full transition-all cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
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
              className="cursor-pointer bg-white border border-[#6c2f00]/15 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 group flex items-start gap-4"
            >
              <img
                src={getAvatarUrl(user.nombre, user.imagenPerfil)}
                alt={user.nombre}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#6c2f00]/15 group-hover:border-[#ff6b6b] transition-colors shrink-0 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display-editorial text-lg font-bold text-[#6c2f00] group-hover:text-[#ff6b6b] transition-colors truncate">
                  {user.nombre || "Usuario Anónimo"}
                </p>
                <p className="font-body-editorial text-xs text-[#54433a] truncate mt-0.5">
                  {user.email}
                </p>
                <p className="font-body-editorial text-xs text-[#54433a]/80 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#6c2f00]">location_on</span>
                  {user.ciudad ? `${user.ciudad}, ` : ""}{user.pais || "País no especificado"}
                </p>
                {user.rol && (
                  <span className="inline-flex items-center gap-1 bg-[#fff1ea] text-[#6c2f00] border border-[#6c2f00]/15 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6c2f00]" />
                    {user.rol}
                  </span>
                )}
              </div>
            </div>
          ))}

          {usuariosFiltrados.length === 0 && (
            <div className="p-12 text-center text-[#54433a] bg-white border border-[#6c2f00]/15 rounded-2xl shadow-xs col-span-full font-body-editorial text-sm font-semibold">
              No se encontraron usuarios que coincidan con los filtros aplicados.
            </div>
          )}
        </div>
      </div>

      {/* Modal Flotante Editorial */}
      {usuarioSeleccionado && (
        <div
          className={`fixed inset-0 bg-[#28180d]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            mostrarModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={cerrarModal}
        >
          <div
            className={`bg-white border border-[#6c2f00]/15 rounded-3xl p-8 max-w-md w-full shadow-2xl relative font-body-editorial transform transition-all duration-300 ${
              mostrarModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-[#6c2f00] hover:text-[#ff6b6b] transition-colors p-2 rounded-full hover:bg-[#fff8f5] cursor-pointer flex items-center justify-center"
              aria-label="Cerrar detalles"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <img
              src={getAvatarUrl(
                usuarioSeleccionado.nombre,
                usuarioSeleccionado.imagenPerfil
              )}
              alt={usuarioSeleccionado.nombre}
              className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[#fff1ea] shadow-md mb-4"
            />

            <h3 className="font-display-editorial text-2xl font-bold text-[#6c2f00] text-center mb-6">
              {usuarioSeleccionado.nombre || "Usuario Anónimo"}
            </h3>

            <div className="space-y-3 text-sm text-[#54433a] bg-[#fff8f5] p-5 rounded-2xl border border-[#6c2f00]/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#6c2f00]">mail</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00]">Email</p>
                  <p className="font-semibold text-[#28180d]">{usuarioSeleccionado.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#6c2f00]">public</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00]">Ubicación</p>
                  <p className="font-semibold text-[#28180d]">
                    {usuarioSeleccionado.ciudad ? `${usuarioSeleccionado.ciudad}, ` : ""}{usuarioSeleccionado.pais || "No especificado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#6c2f00] text-lg">badge</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00]">Rol del Usuario</p>
                  <span className="bg-[#fff1ea] text-[#6c2f00] border border-[#6c2f00]/15 text-xs font-semibold px-3 py-0.5 rounded-full inline-block mt-0.5">
                    {usuarioSeleccionado.rol ?? "Sin rol asignado"}
                  </span>
                </div>
              </div>

              {usuarioSeleccionado.telefono && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-[#6c2f00]">call</span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00]">Teléfono</p>
                    <p className="font-semibold text-[#28180d]">{usuarioSeleccionado.telefono}</p>
                  </div>
                </div>
              )}

              {usuarioSeleccionado.direccion && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-[#6c2f00]">home</span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6c2f00]">Dirección</p>
                    <p className="font-semibold text-[#28180d]">{usuarioSeleccionado.direccion}</p>
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
