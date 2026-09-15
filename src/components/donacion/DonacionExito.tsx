'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const iconContainerVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      duration: 0.7,
    },
  },
};

export default function DonacionExitosaPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

  useEffect(() => {
    console.log('Donación exitosa con session_id:', sessionId);
  }, [sessionId]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial selection:bg-[#c85a32] selection:text-white transition-colors duration-300">
      {/* Halos decorativos de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.15, 0.25, 0.15],
            y: [0, -15, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#c85a32]/20 dark:bg-[#a84320]/25 blur-3xl"
        />
      </div>

      {/* Tarjeta Principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-xl bg-white dark:bg-[#1c1c21] p-7 sm:p-11 rounded-3xl shadow-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 text-center backdrop-blur-xs"
      >
        {/* Badge de confirmación */}
        <motion.div variants={itemVariants} className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/20 shadow-xs">
            <span className="material-symbols-outlined text-sm">verified</span>
            Donación confirmada con éxito
          </span>
        </motion.div>

        {/* Icono central celebratorio */}
        <motion.div
          variants={iconContainerVariants}
          className="mx-auto mb-6 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500/10 via-[#fff1ea] to-[#ffeade] dark:from-emerald-500/20 dark:via-[#26262e] dark:to-[#1c1c21] border-2 border-emerald-500/30 dark:border-emerald-400/30 shadow-inner"
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="material-symbols-outlined text-4xl sm:text-5xl text-emerald-600 dark:text-emerald-400 select-none"
          >
            volunteer_activism
          </motion.span>
        </motion.div>

        {/* Título */}
        <motion.h1
          variants={itemVariants}
          className="font-display-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[#6c2f00] dark:text-[#ffdbc9] mb-3"
        >
          ¡Gracias por tu generosidad! 🐾
        </motion.h1>

        {/* Mensaje de impacto */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-[#54433a] dark:text-[#dac2b6] leading-relaxed mb-6"
        >
          Tu colaboración ayuda directamente a brindar refugio, alimento y atención médica a animales rescatados que esperan un hogar.
        </motion.p>

        {/* Guía de impacto y próximos pasos */}
        <motion.div
          variants={itemVariants}
          className="mb-6 p-5 rounded-2xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 text-left space-y-3.5 text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6]"
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#c85a32] dark:text-[#ff8a65] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">info</span>
            Detalles de tu contribución
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                1
              </div>
              <p>
                <strong className="text-[#2d1810] dark:text-[#ffede4]">Acreditación confirmada:</strong> Tu aporte ya ha sido registrado y destinado a la causa seleccionada.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                2
              </div>
              <p>
                <strong className="text-[#2d1810] dark:text-[#ffede4]">Recibo por correo:</strong> Stripe ha enviado el comprobante oficial de pago a la casilla de correo electrónico que proporcionaste.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                3
              </div>
              <p>
                <strong className="text-[#2d1810] dark:text-[#ffede4]">Seguimiento:</strong> Podés seguir las historias y actualizaciones de las organizaciones en el muro de publicaciones.
              </p>
            </div>
          </div>

          {/* Referencia de sesión si existe */}
          {sessionId && (
            <div className="pt-2 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
              <p className="text-[11px] text-[#877369] dark:text-[#dac2b6] font-mono truncate">
                Ref. de transacción: <span className="font-semibold text-[#6c2f00] dark:text-[#ffdbc9]">{sessionId}</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/publicaciones"
            className="bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial font-semibold py-3.5 px-6 rounded-full text-xs sm:text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer flex-1 active:scale-95"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">
              feed
            </span>
            Ver publicaciones
          </Link>

          <Link
            href="/adoptar/adopcion"
            className="border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] bg-[#fff8f5] dark:bg-[#121214] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] font-body-editorial font-semibold py-3.5 px-6 rounded-full text-xs sm:text-sm transition-all duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer flex-1 active:scale-95"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">
              pets
            </span>
            Conocer mascotas
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
