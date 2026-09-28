'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const DURACION_MS = 3000;

interface NotificacionFlashProps {
  tipo: 'exito' | 'error';
  mensaje: string;
  onCerrar: () => void;
}

export default function NotificacionFlash({ tipo, mensaje, onCerrar }: NotificacionFlashProps) {
  useEffect(() => {
    const timeoutId = setTimeout(onCerrar, DURACION_MS);
    return () => clearTimeout(timeoutId);
  }, [onCerrar]);

  const esExito = tipo === 'exito';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-none">
      <div className="bg-white dark:bg-[#1c1c21] rounded-3xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-2xl p-8 max-w-sm w-full text-center space-y-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto border ${
            esExito
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400'
          }`}
        >
          <span className="material-symbols-outlined text-3xl">
            {esExito ? 'check_circle' : 'error'}
          </span>
        </div>
        <p className="text-[#1c1c21] dark:text-[#ffede4] font-semibold text-sm leading-relaxed">
          {mensaje}
        </p>
      </div>
    </div>,
    document.body,
  );
}
