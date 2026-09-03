"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Mascota } from "@/types/mascotas";
import { Caso } from "@/types/casos";
import {
  getMascotasEnDonacion,
  getMascotasDonacionFiltradas,
} from "@/services/mascotas";
import {
  iniciarDonacion,
  getDetalleDonacionPorCaso,
} from "@/services/donacion";
import MascotaCard from "@/components/adopcion/MascotaCard";
import MascotaModal from "@/components/adopcion/MascotaModal";
import DonarModal from "./DonarModal";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
import { DetalleDonacion } from "@/types/detalledonacion";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../SupabaseProvider";
import Footer from "../Footer";

export default function DonacionPage() {
  const { usuario } = useUsuarioAuth();

  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);

  const [tipo, setTipo] = useState<"perro" | "gato" | "">(""); // filtro tipo
  const [orden, setOrden] = useState<"mas_reciente" | "mas_antiguo">(
    "mas_reciente"
  );
  const [resultados, setResultados] = useState<Caso[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mascotaSeleccionada, setMascotaSeleccionada] =
    useState<Mascota | null>(null);
  const [mostrandoHistoria, setMostrandoHistoria] = useState(false);

  // Estados para el modal de donación
  const [donarModalVisible, setDonarModalVisible] = useState(false);
  const [mascotaParaDonar, setMascotaParaDonar] = useState<Mascota | null>(
    null
  );
  const [detalleDonacion, setDetalleDonacion] =
    useState<DetalleDonacion | null>(null);
  const { token } = useAuth();

  // Detectar sesión supabase (si existe)
  useEffect(() => {
    const obtenerUsuarioSupabase = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.id) {
        setUserSupabaseId(data.user.id);
      }
    };

    obtenerUsuarioSupabase();
  }, []);

  const fetchMascotas = useCallback(async (filtros: { tipo?: string }) => {
    setCargando(true);
    setError("");
    try {
      const data =
        Object.keys(filtros).length === 0
          ? await getMascotasEnDonacion()
          : await getMascotasDonacionFiltradas(filtros);
      setResultados(data);
    } catch {
      setError("Hubo un error al cargar los casos de donación.");
      setResultados([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchMascotas(tipo ? { tipo } : {});
  }, [tipo, fetchMascotas]);

  const resultadosOrdenados = resultados.slice().sort((a, b) => {
    const fechaA = new Date(a.creado_en).getTime();
    const fechaB = new Date(b.creado_en).getTime();
    return orden === "mas_reciente" ? fechaB - fechaA : fechaA - fechaB;
  });

  const handleConocerHistoria = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota);
    setMostrandoHistoria(true);
  };

  const handleDonar = async (mascota: Mascota) => {
    if (!mascota.casoId) {
      toast.error("Falta el caso de la mascota.");
      return;
    }

    try {
      const detalle = await getDetalleDonacionPorCaso(
        mascota.casoId,
        token ?? undefined
      );
      if (!detalle) throw new Error("No se encontró detalle de donación.");
      setDetalleDonacion(detalle);
      setMascotaParaDonar(mascota);
      setDonarModalVisible(true);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar el detalle de la donación.");
    }
  };

  const handleConfirmarDonacion = async (monto: number) => {
    const usuarioId = userSupabaseId || usuario?.id;

    if (!mascotaParaDonar?.casoId || !usuarioId) {
      toast.error("Debes iniciar sesión para donar.");
      return;
    }

    try {
      const data = await iniciarDonacion(
        {
          casoId: mascotaParaDonar.casoId,
          monto,
        },
        token ?? undefined
      );

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("No se pudo generar el link de pago.");
      }
    } catch (error) {
      console.error("Error al iniciar la donación:", error);
      toast.error("Ocurrió un error al iniciar la donación.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#28180d] font-body-editorial flex flex-col selection:bg-[#ff6b6b] selection:text-white">
      <div className="flex-grow max-w-[1280px] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Encabezado Hero Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff1ea] border border-[#6c2f00]/15 text-[#6c2f00] font-body-editorial text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base">favorite</span>
            Donaciones &amp; Casos Críticos
          </div>
          <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl text-[#6c2f00] font-bold tracking-tight mb-4 leading-[1.1]">
            Ayudá a una mascota en <em className="italic text-[#ff6b6b]">situación crítica</em>
          </h1>
          <p className="font-body-editorial text-base sm:text-lg text-[#54433a] leading-relaxed max-w-2xl mx-auto">
            Estos animales necesitan atención médica urgente y refugio. Tu colaboración marca una diferencia real en sus vidas.
          </p>
        </div>

        {/* Panel de Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-12 bg-white border border-[#6c2f00]/15 p-3 rounded-full shadow-xs">
          <div className="relative w-full sm:flex-1">
            <select
              className="appearance-none w-full px-5 py-2.5 pr-10 border border-[#6c2f00]/20 bg-[#fff8f5] text-[#6c2f00] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all cursor-pointer"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as "perro" | "gato" | "")}
            >
              <option value="">Todas las especies</option>
              <option value="perro">🐶 Perros</option>
              <option value="gato">🐱 Gatos</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#6c2f00] pointer-events-none text-xl">
              expand_more
            </span>
          </div>

          <div className="relative w-full sm:flex-1">
            <select
              className="appearance-none w-full px-5 py-2.5 pr-10 border border-[#6c2f00]/20 bg-[#fff8f5] text-[#6c2f00] font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all cursor-pointer"
              value={orden}
              onChange={(e) =>
                setOrden(e.target.value as "mas_reciente" | "mas_antiguo")
              }
            >
              <option value="mas_reciente">Más recientes primero</option>
              <option value="mas_antiguo">Más antiguos primero</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#6c2f00] pointer-events-none text-xl">
              expand_more
            </span>
          </div>
        </div>

        {cargando && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-[#ff6b6b] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-body-editorial text-sm font-semibold text-[#54433a]">
              Cargando casos de donación...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center max-w-md mx-auto my-6 font-body-editorial text-sm font-semibold">
            {error}
          </div>
        )}

        {!cargando && !error && resultados.length === 0 && (
          <div className="bg-white border border-[#6c2f00]/15 rounded-3xl p-12 text-center max-w-md mx-auto my-8 shadow-xs font-body-editorial">
            <span className="material-symbols-outlined text-4xl text-[#ff6b6b] mb-3">pets</span>
            <h3 className="font-display-editorial text-xl font-bold text-[#6c2f00] mb-1">
              No se encontraron casos
            </h3>
            <p className="text-sm text-[#54433a]">
              No hay animales que coincidan con los filtros seleccionados en este momento.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {resultadosOrdenados.map((caso) => {
            const mascotaCompleta: Mascota = {
              ...caso.mascota,
              casoId: caso.id,
              tipo: caso.tipo.toLowerCase(),
              descripcion: caso.descripcion,
            };

            return (
              <MascotaCard
                key={caso.id}
                mascota={mascotaCompleta}
                onConocerHistoria={() => handleConocerHistoria(mascotaCompleta)}
                onAdoptar={() => handleDonar(mascotaCompleta)}
                modo="donacion"
              />
            );
          })}
        </div>
      </div>

      {/* Modal historia */}
      {mascotaSeleccionada && (
        <MascotaModal
          mascota={mascotaSeleccionada}
          visible={mostrandoHistoria}
          cargando={false}
          onClose={() => setMostrandoHistoria(false)}
          onAccion={() => handleDonar(mascotaSeleccionada)}
          modo="donacion"
        />
      )}

      {/* Modal de donación */}
      {donarModalVisible && detalleDonacion && mascotaParaDonar && (
        <DonarModal
          visible={donarModalVisible}
          onClose={() => setDonarModalVisible(false)}
          onConfirm={handleConfirmarDonacion}
          meta={detalleDonacion.metaDonacion}
          recaudado={detalleDonacion.estadoDonacion}
        />
      )}

      <Footer />
    </div>
  );
}
