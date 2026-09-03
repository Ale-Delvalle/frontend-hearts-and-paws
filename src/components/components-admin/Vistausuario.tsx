"use client";

import { getTodosUser } from "@/services/adminconexion";
import React, { useEffect, useState } from "react";

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
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {usuariosFiltrados.map((user) => (
            <div
              key={user.id}
              onClick={() => abrirModal(user)}
              className="cursor-pointer bg-[#ffcfc7] dark:bg-zinc-800 rounded-xl shadow-md p-5 hover:bg-pink-300 dark:hover:bg-zinc-700 transition-all"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={getAvatarUrl(user.nombre, user.imagenPerfil)}
                  alt={user.nombre}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#e87366]"
                />
                <div>
                  <p className="text-lg font-semibold text-[#FA8072]">
                    {user.nombre}
                  </p>
                  <p className="text-sm text-[#FA8072]">{user.email}</p>
                  <p className="text-sm text-[#FA8072]">
                    {user.ciudad}, {user.pais}
                  </p>
                  {user.rol && (
                    <p className="text-xs text-[#FA8072] dark:text-white bg-pink-300 dark:bg-zinc-700 rounded px-2 mt-1 inline-block">
                      Rol: {user.rol}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {usuariosFiltrados.length === 0 && (
            <p className="text-center text-[#FA8072] col-span-full">
              No hay usuarios con esos filtros.
            </p>
          )}
        </div>
      </div>

      {/* Modal flotante */}
      {usuarioSeleccionado && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-pink-300 dark:bg-black bg-opacity-50 dark:bg-opacity-70 z-50 transition-opacity ${
            mostrarModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-[90%] max-w-md transform transition-all duration-300 ${
              mostrarModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-4 text-[#FA8072] hover:text-[#FA8072] text-2xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold text-[#FA8072] mb-4">
              Detalles de {usuarioSeleccionado.nombre}
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <img
                src={getAvatarUrl(
                  usuarioSeleccionado.nombre,
                  usuarioSeleccionado.imagenPerfil
                )}
                alt={usuarioSeleccionado.nombre}
                className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-[#FA8072] mb-4"
              />
              <p>
                <strong>Nombre:</strong> {usuarioSeleccionado.nombre}
              </p>
              <p>
                <strong>Email:</strong> {usuarioSeleccionado.email}
              </p>
              <p>
                <strong>País:</strong> {usuarioSeleccionado.pais}
              </p>
              <p>
                <strong>Rol:</strong> {usuarioSeleccionado.rol ?? "Sin rol"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vistausuario;
