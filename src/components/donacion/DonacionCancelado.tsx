'use client';

import React from 'react';
import Link from 'next/link';
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

export default function DonacionCanceladaPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial selection:bg-[#c85a32] selection:text-white transition-colors duration-300">
      {/* Halos decorativos de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
            y: [0, -15, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#ffdbc9] dark:bg-[#6c2f00]/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.22, 0.12],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#c85a32]/15 dark:bg-[#a84320]/20 blur-3xl"
        />
      </div>

      {/* Tarjeta Principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-xl bg-white dark:bg-[#1c1c21] p-7 sm:p-11 rounded-3xl shadow-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 text-center backdrop-blur-xs"
      >
        {/* Badge de estado */}
        <motion.div variants={itemVariants} className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff1ea] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold tracking-wide shadow-xs">
            <span className="material-symbols-outlined text-sm text-[#c85a32]">
              info
            </span>
            Proceso de Pago Interrumpido • Hearts &amp; Paws
          </span>
        </motion.div>

        {/* Icono central temático */}
        <motion.div
          variants={iconContainerVariants}
          className="mx-auto mb-6 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#fff1ea] to-[#ffeade] dark:from-[#26262e] dark:to-[#1c1c21] border-2 border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 shadow-inner"
        >
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="material-symbols-outlined text-4xl sm:text-5xl text-[#c85a32] select-none"
          >
            volunteer_activism
          </motion.span>
        </motion.div>

        {/* Título */}
        <motion.h1
          variants={itemVariants}
          className="font-display-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[#6c2f00] dark:text-[#ffdbc9] mb-3"
        >
          Donación pausada o cancelada
        </motion.h1>

        {/* Mensaje tranquilizador */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-[#54433a] dark:text-[#dac2b6] leading-relaxed mb-2"
        >
          Notamos que interrumpiste el proceso en la pasarela de pago.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-xs sm:text-sm text-[#877369] dark:text-[#ffdbc9]/70 leading-relaxed mb-6 font-medium"
        >
          No te preocupes: <strong className="text-[#6c2f00] dark:text-[#ffdbc9]">no se ha realizado ningún cobro</strong> en tu cuenta ni en tu medio de pago.
        </motion.p>

        {/* Recuadro de causas / asistencia */}
        <motion.div
          variants={itemVariants}
          className="mb-8 p-5 rounded-2xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 text-left space-y-2.5 text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6]"
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#c85a32] dark:text-[#ff8a65] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">help_outline</span>
            ¿Qué pudo haber ocurrido?
          </h2>

          <div className="space-y-2 pt-1 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <span className="text-[#c85a32] font-bold">•</span>
              <span>Si decidiste cambiar el monto o la forma de pago, podés reiniciar el proceso en cualquier momento.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#c85a32] font-bold">•</span>
              <span>Si la tarjeta fue rechazada o hubo un error de conexión, podés reintentar con otro medio.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#c85a32] font-bold">•</span>
              <span>También podés apoyar compartiendo las historias de rescate en la sección de publicaciones.</span>
            </div>
          </div>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/donacion"
            className="bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial font-semibold py-3.5 px-6 rounded-full text-xs sm:text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer flex-1 active:scale-95"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">
              volunteer_activism
            </span>
            Reintentar donación
          </Link>

          <Link
            href="/"
            className="border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] bg-[#fff8f5] dark:bg-[#121214] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] font-body-editorial font-semibold py-3.5 px-6 rounded-full text-xs sm:text-sm transition-all duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer flex-1 active:scale-95"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">
              home
            </span>
            Ir al inicio
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
