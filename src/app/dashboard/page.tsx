"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMyUser } from "@/services/direccionamiento";
import { useAuth } from "@/components/SupabaseProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [showTimeoutFallback, setShowTimeoutFallback] = useState(false);

  useEffect(() => {
    // Si después de 5 segundos no se completó la redirección, mostrar opciones de ayuda
    const timeout = setTimeout(() => {
      setShowTimeoutFallback(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function checkUsuario() {
      console.log("Llamando getMyUser con token:", token);
      const usuario = await getMyUser(token ?? undefined);

      if (!isMounted) return;

      if (!usuario) {
        console.warn("No se pudo obtener el usuario");
        setShowTimeoutFallback(true);
        return;
      }

      console.log('PAGE : ' + usuario.rol);
      if (usuario.rol === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (usuario.rol === "ong") {
        router.push("/dashboard/ong");
      } else {
        router.push("/dashboard/usuario");
      }
    }

    checkUsuario();

    return () => {
      isMounted = false;
    };
  }, [token, router]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial selection:bg-[#c85a32] selection:text-white transition-colors duration-300">
      {/* Halos decorativos de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.22, 0.12],
            y: [0, -10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#ffdbc9] dark:bg-[#6c2f00]/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#c85a32]/15 dark:bg-[#a84320]/20 blur-3xl"
        />
      </div>

      {/* Tarjeta de Carga y Redirección */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-[#1c1c21] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 text-center backdrop-blur-xs space-y-6"
      >
        {/* Spinner animado con icono de huellita */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          {/* Anillo exterior giratorio */}
          <div className="absolute inset-0 rounded-full border-3 border-[#c85a32]/20 border-t-[#c85a32] animate-spin" />

          {/* Círculo interior con huella pulsante */}
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-14 h-14 rounded-full bg-[#fff1ea] dark:bg-[#26262e] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 flex items-center justify-center shadow-inner"
          >
            <span className="material-symbols-outlined text-2xl text-[#c85a32] select-none">
              pets
            </span>
          </motion.div>
        </div>

        {/* Textos */}
        <div className="space-y-2">
          <h1 className="font-display-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#6c2f00] dark:text-[#ffdbc9]">
            Ingresando a tu panel...
          </h1>
          <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
            Estamos preparando tu espacio personalizado en Hearts &amp; Paws.
          </p>
        </div>

        {/* Barra de progreso sutil */}
        <div className="w-full bg-[#fff1ea] dark:bg-[#26262e] rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#c85a32] via-[#e2734a] to-[#c85a32] rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Opciones de escape si demora */}
        {showTimeoutFallback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-2 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 space-y-3"
          >
            <p className="text-xs text-[#877369] dark:text-[#dac2b6]">
              ¿La redirección está tardando más de lo esperado?
            </p>
            <div className="flex items-center justify-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#c85a32] hover:text-[#a84320] underline transition-colors"
              >
                Volver a Iniciar sesión
              </Link>
              <span className="text-xs text-[#877369]">•</span>
              <Link
                href="/"
                className="text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9] hover:underline transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
