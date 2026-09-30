'use client';

import { useEffect, useState } from 'react';

const DURACION_VISIBLE_MS = 2000;
const DURACION_TRANSICION_MS = 300;

interface NotificacionReconocimientoProps {
  tipo: 'exito' | 'error';
  mensaje: string;
  onCerrar: () => void;
}

export default function NotificacionReconocimiento({
  tipo,
  mensaje,
  onCerrar,
}: NotificacionReconocimientoProps) {
  const [fase, setFase] = useState<'entrando' | 'visible' | 'saliendo'>('entrando');

  // Entra en el siguiente frame para que el navegador anime desde el estado inicial.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setFase('visible'));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (fase !== 'visible') return;
    const timeoutSalida = setTimeout(() => setFase('saliendo'), DURACION_VISIBLE_MS);
    return () => clearTimeout(timeoutSalida);
  }, [fase]);

  useEffect(() => {
    if (fase !== 'saliendo') return;
    const timeoutCierre = setTimeout(onCerrar, DURACION_TRANSICION_MS);
    return () => clearTimeout(timeoutCierre);
  }, [fase, onCerrar]);

  const esExito = tipo === 'exito';
  const mostrando = fase === 'visible';

  return (
    <div
      className={`w-full mb-2 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-300 ease-out ${
        mostrando ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1.5'
      } ${
        esExito
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
          : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400'
      }`}
    >
      <span className="material-symbols-outlined text-base">
        {esExito ? 'check_circle' : 'error'}
      </span>
      {mensaje}
    </div>
  );
}
