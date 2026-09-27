'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

const MAX_CARACTERES_MENSAJE = 500;

interface ModalReconocimientoProps {
  nombreOng: string;
  onConfirmar: (mensaje?: string) => void;
  onCancelar: () => void;
  cargando?: boolean;
}

export default function ModalReconocimiento({
  nombreOng,
  onConfirmar,
  onCancelar,
  cargando,
}: ModalReconocimientoProps) {
  const [mensaje, setMensaje] = useState('');

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancelar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#1c1c21] rounded-3xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-2xl p-8 max-w-md w-full space-y-5"
      >
        <div className="w-14 h-14 rounded-full bg-[#fff1ea] dark:bg-[#2b170f] border border-[#c85a32]/25 text-[#c85a32] flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">verified</span>
        </div>

        <div className="text-center space-y-2">
          <h2 className="font-display-editorial text-xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
            Reconocer a {nombreOng}
          </h2>
          <p className="text-sm text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
            Este reconocimiento es una forma de decirle a la comunidad que confiás en el trabajo de
            esta organización. Se sumará al indicador de confianza visible en su perfil público, y
            vos podrás revocarlo cuando quieras.
          </p>
        </div>

        <div className="text-left">
          <label
            htmlFor="mensaje-reconocimiento"
            className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9]"
          >
            Mensaje para la organización (opcional)
          </label>
          <textarea
            id="mensaje-reconocimiento"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value.slice(0, MAX_CARACTERES_MENSAJE))}
            rows={3}
            placeholder="Este mensaje no se muestra públicamente."
            className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-[#26262e] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#1c1c21] dark:text-[#ffede4] focus:outline-none focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] resize-none"
          />
          <p className="mt-1 text-[11px] text-[#54433a]/70 dark:text-[#dac2b6]/70 text-right">
            {mensaje.length}/{MAX_CARACTERES_MENSAJE}
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-1">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="px-5 py-2.5 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirmar(mensaje.trim() || undefined)}
            disabled={cargando}
            className="px-5 py-2.5 rounded-full bg-[#c85a32] hover:bg-[#a84320] text-white text-xs font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >
            {cargando && (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Confirmar reconocimiento
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
