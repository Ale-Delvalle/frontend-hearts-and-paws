'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LoginErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoCuenta: 'ONG' | 'Usuario';
  mensaje?: string;
}

export default function LoginErrorModal({
  isOpen,
  onClose,
  tipoCuenta,
  mensaje,
}: LoginErrorModalProps) {
  const router = useRouter();

  // Cerrar al presionar Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tipoContrario = tipoCuenta === 'ONG' ? 'Usuario' : 'ONG';
  const textoMensaje =
    mensaje ||
    `Credenciales incorrectas. Verifique que el email ingresado corresponde al tipo de cuenta de ${tipoCuenta}.`;

  const handleCambiarCuenta = () => {
    onClose();
    router.push('/login');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-error-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-body-editorial transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1c1c21] rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 overflow-hidden text-[#1c1c21] dark:text-[#ffede4] text-center transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar esquina superior derecha */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar aviso"
          className="absolute top-4 right-4 text-[#6c2f00] dark:text-[#ffdbc9] hover:text-[#c85a32] dark:hover:text-[#c85a32] transition-colors p-2 rounded-full hover:bg-[#fff8f5] dark:hover:bg-[#26262e] cursor-pointer flex items-center justify-center z-10"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Ícono destacado */}
        <div className="w-16 h-16 rounded-full bg-[#fff1ea] dark:bg-[#2b170f] border border-[#c85a32]/25 text-[#c85a32] flex items-center justify-center mx-auto mb-4 shadow-inner">
          <span className="material-symbols-outlined text-3xl">lock_reset</span>
        </div>

        {/* Título del modal */}
        <h3
          id="login-error-modal-title"
          className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-3 tracking-tight"
        >
          Credenciales incorrectas
        </h3>

        {/* Mensaje descriptivo */}
        <div className="bg-[#fff8f5] dark:bg-[#121214] p-4 rounded-2xl border border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 text-[#54433a] dark:text-[#dac2b6] text-sm mb-4 leading-relaxed">
          <p className="font-semibold text-[#6c2f00] dark:text-[#ffdbc9] mb-1">
            {textoMensaje}
          </p>
          <p className="text-xs text-[#54433a]/80 dark:text-[#dac2b6]/80 mt-2">
            💡 ¿Tenés una cuenta como <strong>{tipoContrario}</strong>? Verificá que estés utilizando el formulario correcto para ingresar.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold text-sm px-5 py-3 rounded-full shadow-md transition-all duration-300 cursor-pointer"
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={handleCambiarCuenta}
            className="flex-1 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] bg-[#fff8f5] dark:bg-[#121214] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] font-semibold text-sm px-5 py-3 rounded-full transition-all duration-300 cursor-pointer"
          >
            Cambiar tipo de cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
