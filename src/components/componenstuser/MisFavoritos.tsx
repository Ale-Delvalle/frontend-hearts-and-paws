'use client';

import { useEffect, useState, useCallback } from "react";
import {
  getFavoritosPorUsuario,
  putAgregarAFavoritos,
} from "@/services/favoritos";
import {
  iniciarDonacion,
  getDetalleDonacionPorCaso,
} from "@/services/donacion";
import MascotaCard from "@/components/adopcion/MascotaCard";
import DonarModal from "@/components/donacion/DonarModal";
import { useAuth } from "@/components/SupabaseProvider";
import { Mascota } from "@/types/mascotas";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";

interface Imagen { url: string; }
interface MascotaFavorito { id?: string; nombre: string; imagenes?: Imagen[]; }
interface CasoFavorito {
  id: string; titulo: string; descripcion: string;
  tipo: "ADOPCION" | "DONACION" | string;
  mascotaId: string; creado_en: string;
  mascota: MascotaFavorito;
}
interface Favorito {
  id: string;
  casoId: string;
  caso: CasoFavorito;
}

export default function MisFavoritos() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [donarModalVisible, setDonarModalVisible] = useState(false);
  const [casoDonacionId, setCasoDonacionId] = useState<string | null>(null);
  const [detalleDonacion, setDetalleDonacion] = useState<{ meta: number; recaudado: number } | null>(null);
    const { usuario } = useUsuarioAuth();

  const fetchFavoritos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Token para favoritos:", token);
      const data = await getFavoritosPorUsuario(token ?? undefined);
      console.log("Favoritos obtenidos:", data);
      setFavoritos(data);
    } catch {
      setError("Error al cargar tus favoritos. Asegurate de estar logueado.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token !== undefined) fetchFavoritos();
  }, [fetchFavoritos, token]);

  const handleEliminarFavorito = async (fav: Favorito) => {
    if (!user && !usuario) {
      toast.error("Debes estar logueado para quitar favoritos");
      return;
    }
    try {
      await putAgregarAFavoritos(fav.casoId, token ?? undefined);
      toast.success("Favorito eliminado");
      fetchFavoritos();
    } catch {
      toast.error("No se pudo eliminar el favorito");
    }
  };


  const handleAdoptarODonar = async (casoId: string) => {
    const fav = favoritos.find((f) => f.caso.id === casoId);
    if (!fav) return toast.error("No se pudo encontrar el caso.");
    const tipo = fav.caso.tipo.toLowerCase() === "adopcion" ? "adopcion" : "donacion";

    const mascotaApi = fav.caso.mascota;
    if (!mascotaApi) return;
    const mascota: Mascota = {
      id: mascotaApi.id ?? fav.caso.mascotaId,
      casoId: fav.caso.id,
      nombre: mascotaApi.nombre,
      tipo,
      descripcion: fav.caso.descripcion,
      imagenes: (mascotaApi.imagenes ?? []).map((img, idx) => ({ id: img.url || `${idx}`, url: img.url })),
    };

    if (mascota.tipo === "adopcion") {
      toast.success(`¡Gracias por querer adoptar a ${mascota.nombre}!`);
      router.push(`/adoptar/formulario-adopcion?id=${mascota.casoId}`);
    } else {
      setCasoDonacionId(mascota.casoId);
      setDonarModalVisible(true);
      try {
        const det = await getDetalleDonacionPorCaso(mascota.casoId, token ?? undefined);
        if (det) setDetalleDonacion({ meta: det.metaDonacion, recaudado: det.estadoDonacion });
        else toast.error("No se pudo obtener la información de la donación.");
      } catch {
        toast.error("Ocurrió un error al cargar los datos de donación.");
      }
    }
  };

 const handleConfirmarDonacion = async (monto: number): Promise<void> => {
  const usuarioId = user?.id || usuario?.id;

  if (!casoDonacionId || !usuarioId) {
    toast.error("Error: falta información para realizar la donación.");
    return;
  }

  try {
    const res = await iniciarDonacion({ casoId: casoDonacionId, monto }, token ?? undefined);
    if (res?.url) {
      window.location.href = res.url;
    } else {
      toast.error("No se pudo generar el link de pago.");
    }
  } catch {
    toast.error("Ocurrió un error al iniciar la donación.");
  }
};



  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial flex justify-center py-10 md:py-16 px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-start justify-center gap-6 lg:gap-8 max-w-5xl w-full">
        {/* Sidebar centrado estilo Earth & Heart */}
        <nav className="flex flex-col p-6 bg-[#ffeade] dark:bg-[#1c1c21] rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 w-full md:w-64 shadow-none flex-shrink-0">
          <div className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#ffdbc9]">person</span>
            <span>Perfil</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/dashboard/usuario")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffe3d2] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition-all duration-300 flex items-center gap-3"
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
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold bg-[#fff1ea] dark:bg-[#26262e] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 transition-all duration-300 flex items-center gap-3"
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

        {/* Contenido principal */}
        <main className="flex-1 w-full max-w-3xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="font-display-editorial text-3xl md:text-4xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
                Mis Favoritos
              </h1>
              <p className="font-body-editorial text-sm text-[#54433a] dark:text-[#dac2b6] mt-1">
                Mascotas guardadas para seguir su historia
              </p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-3xl text-[#6c2f00] dark:text-[#ffdbc9] animate-spin mb-2">progress_activity</span>
              <p className="font-body-editorial text-sm text-[#54433a] dark:text-[#dac2b6]">Cargando tus favoritos...</p>
            </div>
          )}

          {error && (
            <div className="bg-[#ffdad6] text-[#93000a] p-4 rounded-xl text-center text-sm font-body-editorial border border-[#ba1a1a]/20">
              {error}
            </div>
          )}

          {!loading && !error && favoritos.length === 0 && (
            <div className="bg-[#fff1ea] dark:bg-[#1c1c21] rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 p-10 text-center">
              <span className="material-symbols-outlined text-4xl text-[#6c2f00] dark:text-[#ffdbc9] mb-3 opacity-60">favorite</span>
              <p className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-2">No tenés favoritos guardados aún</p>
              <p className="font-body-editorial text-sm text-[#54433a] dark:text-[#dac2b6] max-w-md mx-auto mb-6">
                Guarda aquí las mascotas que llamen tu atención para seguirlas de cerca o iniciar el proceso de adopción.
              </p>
              <button
                onClick={() => router.push('/adoptar/adopcion')}
                className="bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm inline-flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-base">search</span>
                <span>Explorar Mascotas</span>
              </button>
            </div>
          )}

          {!loading && !error && favoritos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favoritos.map((fav) => {
                const mascotaApi = fav.caso.mascota;
                if (!mascotaApi) return null;
                const mascota: Mascota = {
                  id: mascotaApi.id ?? fav.caso.mascotaId,
                  casoId: fav.caso.id,
                  nombre: mascotaApi.nombre,
                  tipo: fav.caso.tipo.toLowerCase() === "adopcion" ? "adopcion" : "donacion",
                  imagenes: (mascotaApi.imagenes ?? []).map((img, idx) => ({ id: img.url || `${idx}`, url: img.url })),
                  descripcion: fav.caso.descripcion,
                };
                return (
                  <div key={fav.id} className="relative group">
                    <MascotaCard
                      mascota={mascota}
                      modo={mascota.tipo as "adopcion" | "donacion"}
                      onVerPerfil={() => router.push(`/mascotas/${mascota.id}`)}
                      onConocerHistoria={() => router.push(`/mascotas/${mascota.id}`)}
                      onAdoptar={() => handleAdoptarODonar(mascota.casoId)}
                      mostrarFavorito={false}
                    />
                    <button
                      onClick={() => handleEliminarFavorito(fav)}
                      className="absolute top-3 right-3 bg-white/90 dark:bg-[#1c1c21]/90 backdrop-blur-sm p-2 rounded-full text-[#6c2f00] dark:text-[#ffdbc9] hover:text-[#a84320] dark:hover:text-[#c85a32] hover:scale-110 transition-all shadow-sm z-20 cursor-pointer"
                      aria-label="Eliminar favorito"
                      title="Quitar de favoritos"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}



          <DonarModal
            visible={donarModalVisible}
            onClose={() => { setDonarModalVisible(false); setDetalleDonacion(null); }}
            onConfirm={handleConfirmarDonacion}
            meta={detalleDonacion?.meta ?? 0}
            recaudado={detalleDonacion?.recaudado ?? 0}
          />
        </main>
      </div>
    </div>
  );
}
