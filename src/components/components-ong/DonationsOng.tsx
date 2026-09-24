"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOngAuth } from "@/context/OngAuthContext";
import { Donacion, getDonacionesPorOng } from "@/services/donacionesOng";

const TASA_CAMBIO = 1205; // 1 USD = 1205 ARS

export default function DonationsOng() {
  const { ong } = useOngAuth();
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ong?.id) {
      setLoading(false);
      return;
    }

    getDonacionesPorOng()
      .then((data) => {
        const donacionesOrdenadas = data
          .slice()
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        setDonaciones(donacionesOrdenadas);
        setError(null);
      })
      .catch((e) => {
        console.error(e);
        setError("No se pudieron cargar las donaciones.");
      })
      .finally(() => setLoading(false));
  }, [ong?.id]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-12 text-center shadow-xs font-body-editorial">
        <div className="w-10 h-10 border-4 border-[#c85a32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display-editorial text-lg text-[#6c2f00] dark:text-[#ffdbc9] font-bold">Cargando historial de donaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-12 text-center shadow-xs font-body-editorial">
        <span className="material-symbols-outlined text-5xl text-[#c85a32] mb-3">error</span>
        <p className="text-sm text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!ong) {
    return (
      <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-12 text-center shadow-xs font-body-editorial">
        <span className="material-symbols-outlined text-5xl text-[#6c2f00]/40 dark:text-[#ffdbc9]/40 mb-3">domain</span>
        <h3 className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-2">No se encontró la organización</h3>
        <p className="text-sm text-[#54433a] dark:text-[#dac2b6]">Inicia sesión para visualizar las donaciones recibidas.</p>
      </div>
    );
  }

  const totalUSD = donaciones.reduce((acc, curr) => acc + (curr.monto || 0), 0);
  const totalARS = totalUSD * TASA_CAMBIO;

  return (
    <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-3xl p-6 sm:p-8 shadow-xs font-body-editorial transition-colors">
      {/* Encabezado */}
      <div className="mb-6 pb-6 border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fff1ea] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold mb-3">
          <span className="material-symbols-outlined text-base text-[#c85a32]">volunteer_activism</span>
          Aportes Recibidos
        </div>
        <h1 className="font-display-editorial text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
          Historial de Donaciones
        </h1>
        <p className="text-sm text-[#54433a] dark:text-[#dac2b6] mt-1">
          Consulta y haz seguimiento de los aportes económicos destinados a tu organización y mascotas rescatadas.
        </p>
      </div>

      {/* Resumen Métrico */}
      {donaciones.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-[#fff8f5] dark:bg-[#121214] rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
            <p className="text-xs uppercase font-bold text-[#54433a] dark:text-[#dac2b6] flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-base text-[#6c2f00] dark:text-[#ffdbc9]">monetization_on</span>
              Total Recaudado
            </p>
            <p className="font-display-editorial text-2xl font-bold text-[#c85a32]">
              ${totalUSD.toLocaleString("es-AR")} USD
            </p>
            <p className="text-xs text-[#54433a] dark:text-[#dac2b6] mt-0.5">
              ≈ ${totalARS.toLocaleString("es-AR")} ARS (Tasa $1.205)
            </p>
          </div>

          <div className="p-4 bg-[#fff8f5] dark:bg-[#121214] rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
            <p className="text-xs uppercase font-bold text-[#54433a] dark:text-[#dac2b6] flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-base text-[#6c2f00] dark:text-[#ffdbc9]">receipt_long</span>
              Cantidad de Aportes
            </p>
            <p className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
              {donaciones.length} {donaciones.length === 1 ? "donación" : "donaciones"}
            </p>
            <p className="text-xs text-[#54433a] dark:text-[#dac2b6] mt-0.5">
              Registradas en la plataforma
            </p>
          </div>
        </div>
      )}

      {/* Lista de Donaciones */}
      {donaciones.length === 0 ? (
        <div className="p-12 text-center bg-[#fff8f5] dark:bg-[#121214] rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
          <span className="material-symbols-outlined text-5xl text-[#6c2f00]/30 dark:text-[#ffdbc9]/30 mb-3">inbox</span>
          <h3 className="font-display-editorial text-lg font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1">
            No hay donaciones registradas aún
          </h3>
          <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6]">
            Cuando los donantes realicen aportes a tus casos publicados, aparecerán listados aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {donaciones.map((donacion) => {
            const montoEnPesos = donacion.monto * TASA_CAMBIO;
            const estado = donacion.estadoPago?.toLowerCase() || "";

            const configEstado: Record<string, { label: string; icon: string; classes: string }> = {
              paid: {
                label: "Pagado",
                icon: "check_circle",
                classes: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
              },
              pending: {
                label: "Pendiente",
                icon: "hourglass_empty",
                classes: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
              },
              failed: {
                label: "Fallido",
                icon: "cancel",
                classes: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
              },
              canceled: {
                label: "Cancelado",
                icon: "block",
                classes: "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800",
              },
            };

            const infoEstado = configEstado[estado] || {
              label: donacion.estadoPago || "Desconocido",
              icon: "help",
              classes: "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800",
            };

            return (
              <div
                key={donacion.id}
                className="bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 rounded-2xl p-5 shadow-xs hover:border-[#6c2f00]/25 dark:hover:border-[#ffdbc9]/25 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {donacion.usuario?.id ? (
                      <Link
                        href={`/usuario/${donacion.usuario.id}`}
                        className="font-display-editorial text-lg font-bold text-[#6c2f00] dark:text-[#ffdbc9] truncate hover:underline"
                      >
                        {donacion.usuario.nombre}
                      </Link>
                    ) : (
                      <span className="font-display-editorial text-lg font-bold text-[#6c2f00] dark:text-[#ffdbc9] truncate">
                        Donante Anónimo
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${infoEstado.classes}`}
                    >
                      <span className="material-symbols-outlined text-xs">{infoEstado.icon}</span>
                      {infoEstado.label}
                    </span>
                  </div>

                  {donacion.usuario?.email && (
                    <p className="text-xs text-[#54433a] dark:text-[#dac2b6] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#6c2f00] dark:text-[#ffdbc9]">mail</span>
                      {donacion.usuario.email}
                    </p>
                  )}

                  {donacion.mascota && (
                    <p className="text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#c85a32]">pets</span>
                      Mascota: {donacion.mascota.nombre}
                    </p>
                  )}

                  <p className="text-[11px] text-[#54433a]/80 dark:text-[#dac2b6]/80 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    {new Date(donacion.fecha).toLocaleString("es-AR")}
                  </p>
                </div>

                <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
                  <p className="font-display-editorial text-2xl font-bold text-[#c85a32]">
                    ${donacion.monto.toLocaleString("es-AR")} USD
                  </p>
                  <p className="text-xs text-[#54433a] dark:text-[#dac2b6]">
                    ≈ ${montoEnPesos.toLocaleString("es-AR")} ARS
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
