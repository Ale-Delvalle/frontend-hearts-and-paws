'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

export default function LoginSupabaseForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('Error al iniciar sesión:', error.message);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado al conectar con Google';
      console.error(msg);
      setErrorMessage(msg);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loginWithGoogle();
  }, [loginWithGoogle]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-md bg-white dark:bg-[#1c1c21] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 text-center backdrop-blur-xs space-y-6"
    >
      {/* Badge de seguridad */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fff1ea] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold tracking-wide shadow-xs">
          <span className="material-symbols-outlined text-sm text-[#c85a32]">lock</span>
          Acceso Seguro • Hearts &amp; Paws
        </span>
      </div>

      {/* Ícono de Google estilizado con anillo animado */}
      <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 rounded-full border-3 border-[#c85a32]/25 border-t-[#c85a32] animate-spin" />
        )}
        <div className="w-14 h-14 rounded-full bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 flex items-center justify-center shadow-inner">
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.26a11.97 11.97 0 0 0 0 10.84l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        </div>
      </div>

      {/* Título y descripción */}
      <div className="space-y-2">
        <h1 className="font-display-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#6c2f00] dark:text-[#ffdbc9]">
          {isLoading ? 'Conectando con Google...' : 'No pudimos conectar con Google'}
        </h1>
        <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
          {isLoading
            ? 'Serás redirigido a la pantalla oficial de acceso seguro en unos instantes.'
            : 'Ocurrió un inconveniente al intentar iniciar la sesión.'}
        </p>
      </div>

      {/* Barra de progreso */}
      {isLoading ? (
        <div className="w-full bg-[#fff1ea] dark:bg-[#26262e] rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#c85a32] via-[#e2734a] to-[#c85a32] rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: 'easeInOut',
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300 text-left">
              <p className="font-semibold mb-1">Detalle del error:</p>
              <p className="font-mono text-[11px] break-all">{errorMessage}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={loginWithGoogle}
              className="bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial font-semibold py-3 px-5 rounded-full text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer flex-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Reintentar
            </button>

            <Link
              href="/login"
              className="border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] bg-[#fff8f5] dark:bg-[#121214] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] font-body-editorial font-semibold py-3 px-5 rounded-full text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer flex-1 active:scale-95"
            >
              Volver
            </Link>
          </div>
        </div>
      )}

      {/* Pie de seguridad */}
      <div className="pt-2 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
        <p className="text-[11px] text-[#877369] dark:text-[#dac2b6] flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-xs text-[#c85a32]">verified_user</span>
          Tus datos viajan cifrados bajo el estándar OAuth 2.0
        </p>
      </div>
    </motion.div>
  );
}
