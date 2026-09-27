'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMisReconocimientos } from '@/services/ongProfile';
import { ReconocimientoRecibido } from '@/types/ong';

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function FilaReconocimiento({ r }: { r: ReconocimientoRecibido }) {
  const revocado = Boolean(r.revocado_en);
  const feedback = revocado ? r.motivoRevocacion : r.mensaje;
  const hrefAutor = r.otorgadoPor.tipo === 'USUARIO' ? `/usuario/${r.otorgadoPor.id}` : `/ong/${r.otorgadoPor.id}`;

  return (
    <div className="bg-white dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 rounded-2xl p-5 shadow-xs space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={hrefAutor}
          className="font-display-editorial text-base font-bold text-[#6c2f00] dark:text-[#ffdbc9] hover:underline"
        >
          {r.otorgadoPor.nombre}
        </Link>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            revocado
              ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
          }`}
        >
          <span className="material-symbols-outlined text-xs">{revocado ? 'remove_circle' : 'verified'}</span>
          {revocado ? 'Revocado' : 'Vigente'}
        </span>
      </div>

      <p className="text-xs text-[#54433a] dark:text-[#dac2b6]">
        Otorgado el {formatFecha(r.creado_en)}
        {revocado && r.revocado_en && ` · Revocado el ${formatFecha(r.revocado_en)}`}
      </p>

      <p className="text-sm text-[#1c1c21] dark:text-[#ffede4] italic">
        {feedback ? `“${feedback}”` : 'Sin feedback'}
      </p>
    </div>
  );
}

export default function ReconocimientosOng() {
  const [reconocimientos, setReconocimientos] = useState<ReconocimientoRecibido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMisReconocimientos()
      .then(setReconocimientos)
      .catch(() => setError('No se pudieron cargar los reconocimientos.'))
      .finally(() => setLoading(false));
  }, []);

  const vigentes = reconocimientos.filter((r) => !r.revocado_en);
  const revocados = reconocimientos.filter((r) => r.revocado_en);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#6c2f00] dark:text-[#ffdbc9] gap-3">
        <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
        <span className="text-sm font-semibold">Cargando reconocimientos...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400 p-6">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1">
          Reconocimientos vigentes
        </h2>
        <p className="text-xs text-[#54433a] dark:text-[#dac2b6] mb-4">
          Suman al indicador de confianza de tu perfil público. Total: {vigentes.length}
        </p>
        {vigentes.length === 0 ? (
          <p className="text-sm text-[#54433a] dark:text-[#dac2b6]">Todavía no recibiste reconocimientos.</p>
        ) : (
          <div className="space-y-3">
            {vigentes.map((r) => (
              <FilaReconocimiento key={r.id} r={r} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1">
          Reconocimientos revocados
        </h2>
        <p className="text-xs text-[#54433a] dark:text-[#dac2b6] mb-4">
          Ya no cuentan en el indicador de confianza. Total: {revocados.length}
        </p>
        {revocados.length === 0 ? (
          <p className="text-sm text-[#54433a] dark:text-[#dac2b6]">No tenés reconocimientos revocados.</p>
        ) : (
          <div className="space-y-3">
            {revocados.map((r) => (
              <FilaReconocimiento key={r.id} r={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
