"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/SupabaseProvider";
import {
  ActualizarPerfil,
  ActualizarUsuario,
} from "@/services/dashboarusernormal";
import toast from "react-hot-toast";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
import { supabase } from "@/lib/supabaseClient";
import InsigniaBadge from "@/components/insignias/InsigniaBadge";
import { GeneroUsuario } from "@/types/insignia";

interface UsuarioUpdateData {
  email?: string;
  contrasena?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  genero?: GeneroUsuario;
}

export default function DashboardSencillo() {
  const { user } = useAuth();
  const router = useRouter();
  const { usuario } = useUsuarioAuth();
  const { token } = useAuth();

  const [isEditando, setIsEditando] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  

  const [userData, setUserData] = useState<{
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    pais: string;
    genero?: GeneroUsuario;
    imagenPerfil?: string;
  }>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    pais: "",
  });

  useEffect(() => {
    if (!user && !usuario) return;

    if (usuario) {
      setUserData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        direccion: usuario.direccion || "",
        ciudad: usuario.ciudad || "",
        pais: usuario.pais || "",
        genero: usuario.genero || undefined,
        imagenPerfil: usuario.imagenPerfil || "",
      });
    } else if (user) {
      setUserData({
        nombre:
          user.user_metadata["full_name"] || user.user_metadata["name"] || "",
        email: user?.email || "",
        telefono: "",
        direccion: "",
        ciudad: "",
        pais: "",
        imagenPerfil:
          user.user_metadata["avatar_url"] ||
          user.user_metadata["picture"] ||
          "",
      });
    }
  }, [user, usuario]);

  useEffect(() => {
    if (!user && !usuario) {
      // router.push("/login");
    }
  }, [user, router, usuario]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);
  useEffect(() => {
  const cargarDatosDesdeSupabase = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error al obtener usuario:", error);
      return;
    }

    const user = data?.user;
    if (user) {
      const meta = user.user_metadata || {};

      setUserData((prev) => ({
        ...prev,
        nombre: meta.nombre || prev.nombre, 
        telefono: meta.telefono || '',
        direccion: meta.direccion || '',
        ciudad: meta.ciudad || '',
        pais: meta.pais || '',
        imagenPerfil: meta.imagenPerfil || prev.imagenPerfil, 
      }));
    }
  };

  cargarDatosDesdeSupabase();
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeGenero = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserData((prev) => ({ ...prev, genero: e.target.value as GeneroUsuario }));
  };

 const handleGuardar = async () => {
  try {
    const idUsuario = user?.id || usuario?.id;
    if (!idUsuario) throw new Error("Usuario no autenticado");

    const { email, telefono, direccion, ciudad, pais, genero } = userData;

    const datos: UsuarioUpdateData = { email, telefono, direccion, ciudad, pais, genero };

    // 1. Actualiza en tu backend
    await ActualizarUsuario(datos, token ?? undefined);

    // 2. Actualiza metadata de Supabase
    await supabase.auth.updateUser({
      data: { telefono, direccion, ciudad, pais },
    });

    // 3. Recupera el usuario actualizado
    const { data: userActualizado } = await supabase.auth.getUser();
    if (userActualizado?.user) {
      const meta = userActualizado.user.user_metadata || {};
      setUserData((prev) => ({
        ...prev,
        telefono: meta.telefono || '',
        direccion: meta.direccion || '',
        ciudad: meta.ciudad || '',
        pais: meta.pais || '',
      }));
    }

    toast.success("Perfil actualizado correctamente 🎉");
    setIsEditando(false);
  } catch (error) {
    console.error("Error al guardar perfil:", error);
    toast.error("Error inesperado al guardar.");
  }
};



  const handleActualizar = async (archivo: File) => {
    setUploading(true);
    try {
      const respuesta = await ActualizarPerfil(archivo, token!);
      // Obtener la URL real del backend (Cloudinary)
      const urlReal = respuesta.imagenPerfil;
      
      setUserData((prev) => ({
        ...prev,
        imagenPerfil: urlReal,
      }));
      
      setPreviewUrl(urlReal);
      toast.success("Foto de perfil actualizada ✅");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast.error("Error al actualizar la foto de perfil");
    } finally {
      setUploading(false);
    }
  };

  if (!user && !usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial">
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial flex justify-center py-10 md:py-16 px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-start justify-center gap-6 lg:gap-8 max-w-5xl w-full">
        {/* Navegación lateral estilo Earth & Heart centrada junto al contenedor */}
        <nav className="flex flex-col p-6 bg-[#ffeade] dark:bg-[#1c1c21] rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 w-full md:w-64 shadow-none flex-shrink-0">
          <div className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#ffdbc9]">person</span>
            <span>Perfil</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/dashboard/usuario")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold bg-[#fff1ea] dark:bg-[#26262e] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">home</span>
              <span>Principal</span>
            </button>
            <button
              onClick={() => router.push("/usuario/adopciones")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">pets</span>
              <span>Mis Adopciones</span>
            </button>
            <button
              onClick={() => router.push("/usuario/donaciones")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">volunteer_activism</span>
              <span>Mis Donaciones</span>
            </button>
            <button
              onClick={() => router.push("/usuario/favoritos")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">favorite</span>
              <span>Mis Favoritos</span>
            </button>
            <button
              onClick={() => router.push("/chat")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all duration-300 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>Mensajes</span>
            </button>
          </div>
        </nav>

        {/* Contenido principal editorial */}
        <main className="flex-1 w-full max-w-3xl">
          <section className="w-full bg-[#fff1ea] dark:bg-[#1c1c21] rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 p-8 md:p-10 shadow-none">
          {/* Avatar y Encabezado */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-[#6c2f00]/15 dark:border-[#ffdbc9]/15">
            <div className="relative w-28 h-28 flex-shrink-0">
              <div className="w-28 h-28 rounded-full border-2 border-[#6c2f00]/30 dark:border-[#ffdbc9]/30 shadow-none overflow-hidden relative bg-[#fff8f5] dark:bg-[#26262e] flex items-center justify-center">
                {uploading ? (
                  <span className="text-xs text-[#6c2f00] dark:text-[#ffdbc9] font-semibold animate-pulse flex items-center justify-center h-full">
                    Cargando...
                  </span>
                ) : (
                  <img
                    src={
                      previewUrl ||
                      userData.imagenPerfil ||
                      "/default-avatar.png"
                    }
                    alt={`Foto de perfil de ${userData.nombre}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <label
                htmlFor="imagen-perfil"
                className="absolute bottom-0 right-0 bg-[#c85a32] hover:bg-[#a84320] text-white p-2 rounded-full cursor-pointer transition-all duration-300 shadow-sm flex items-center justify-center"
                title="Cambiar imagen"
              >
                <span className="material-symbols-outlined text-base">photo_camera</span>
                <input
                  id="imagen-perfil"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const archivo = e.target.files?.[0];
                    if (archivo) handleActualizar(archivo);
                  }}
                />
              </label>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display-editorial text-3xl md:text-4xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] leading-tight">
                Hola, {userData.nombre || "Usuario"}!
              </h1>
              <p className="font-body-editorial text-sm md:text-base text-[#54433a] dark:text-[#dac2b6] mt-1">
                Bienvenido a tu perfil personal en Hearts&amp;Paws
              </p>

              {usuario?.insignias && usuario.insignias.length > 0 && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  {usuario.insignias.map((insignia) => (
                    <InsigniaBadge key={insignia.id} insignia={insignia} genero={usuario.genero} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulario */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGuardar();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            {(
              [
                "nombre",
                "email",
                "telefono",
                "direccion",
                "ciudad",
                "pais",
              ] as const
            ).map((campo) => (
              <div key={campo}>
                <label
                  htmlFor={campo}
                  className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9] font-body-editorial"
                >
                  {campo}
                </label>

                {campo === "email" ? (
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    value={userData.email}
                    onClick={() =>
                      toast(
                        "El email es un campo definido que no permite edición"
                      )
                    }
                    className="w-full px-4 py-3 rounded-lg text-sm bg-black/5 dark:bg-white/5 border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#54433a] dark:text-[#dac2b6] cursor-not-allowed transition-all duration-300"
                  />
                ) : (
                  <input
                    id={campo}
                    name={campo}
                    type="text"
                    disabled={!isEditando}
                    value={userData[campo]}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                      isEditando
                        ? "bg-white dark:bg-[#26262e] border border-[#6c2f00]/40 dark:border-[#ffdbc9]/40 text-[#1c1c21] dark:text-[#ffede4] focus:outline-none focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32]"
                        : "bg-black/5 dark:bg-white/5 border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#54433a] dark:text-[#dac2b6] cursor-not-allowed"
                    }`}
                    required={campo === "nombre"}
                  />
                )}
              </div>
            ))}

            <div>
              <label
                htmlFor="genero"
                className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9] font-body-editorial"
              >
                género
              </label>
              <select
                id="genero"
                name="genero"
                disabled={!isEditando}
                value={userData.genero || ""}
                onChange={handleChangeGenero}
                className={`w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                  isEditando
                    ? "bg-white dark:bg-[#26262e] border border-[#6c2f00]/40 dark:border-[#ffdbc9]/40 text-[#1c1c21] dark:text-[#ffede4] focus:outline-none focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32]"
                    : "bg-black/5 dark:bg-white/5 border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#54433a] dark:text-[#dac2b6] cursor-not-allowed"
                }`}
              >
                <option value="" disabled>
                  Seleccioná una opción
                </option>
                <option value="FEMENINO">Femenino</option>
                <option value="MASCULINO">Masculino</option>
              </select>
            </div>

            <div className="col-span-full flex justify-end gap-4 mt-6 pt-4 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/15">
              {!isEditando ? (
                <button
                  type="button"
                  onClick={() => setIsEditando(true)}
                  className="bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial font-semibold px-8 py-3 rounded-full transition-all duration-300 ease-in-out shadow-sm hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  <span>Editar Perfil</span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditando(false)}
                    className="bg-transparent border border-[#6c2f00]/30 dark:border-[#ffdbc9]/30 text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] font-body-editorial font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Cancelar</span>
                  </button>
                  <button
                    type="submit"
                    className="bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial font-semibold px-8 py-3 rounded-full transition-all duration-300 ease-in-out shadow-sm hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">save</span>
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              )}
            </div>
          </form>
        </section>
      </main>
      </div>
    </div>
  );
}
