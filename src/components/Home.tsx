'use client';

import Image from 'next/image';
import { FaHome, FaExclamation, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import GlobalTimeline from './components-feed/GlobalTimeline';


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start text-[#28180d] dark:text-gray-200 bg-[#fff8f5] dark:bg-black min-w-full overflow-x-hidden font-body-editorial">

      {/* Hero Inmersivo Editorial (Paso 2) */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 transform scale-105 transition-transform duration-1000">
          <Image
            src="/pexels.jpg"
            alt="Conectando historias y rescates"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Capa de gradiente cálido editorial */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fff8f5] via-black/40 to-black/60 dark:from-black dark:via-black/60 dark:to-black/80 z-10" />

        <div className="relative z-20 max-w-[1280px] mx-auto px-5 md:px-8 text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display-editorial text-4xl sm:text-5xl md:text-6xl text-white font-bold mb-6 drop-shadow-lg max-w-4xl leading-tight"
          >
            Cada huella tiene una historia. Ayúdanos a escribir la siguiente.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body-editorial text-lg md:text-xl text-white/90 max-w-2xl mb-10 drop-shadow-md"
          >
            Descubre las historias de rescate más conmovedoras y únete a nuestra comunidad para cambiar vidas, una adopción a la vez.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#historias"
              className="bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-body-editorial font-semibold px-8 py-4 rounded-full transition-all duration-300 ease-in-out shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined">pets</span> Adoptar ahora
            </a>
            <a
              href="#como-funciona"
              className="bg-transparent border border-white/80 text-white hover:bg-white/10 font-body-editorial font-semibold px-8 py-4 rounded-full transition-all duration-300 ease-in-out backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined">favorite</span> Donar
            </a>
          </motion.div>
        </div>
      </section>


      {/* Declaración de Misión Editorial (Paso 3) */}
      <section className="py-20 md:py-28 px-5 md:px-8 max-w-[1280px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#ffb68c] text-5xl mb-6 opacity-90">
            volunteer_activism
          </span>
          <h2 className="font-display-editorial text-3xl md:text-4xl text-[#8b4513] dark:text-[#ffb68c] mb-6 font-semibold">
            Unimos fuerzas por los que no tienen voz
          </h2>
          <p className="font-body-editorial text-lg md:text-xl text-[#54433a] dark:text-gray-300 leading-relaxed">
            Hearts&amp;Paws no es solo una plataforma; es un movimiento editorial dedicado a elevar la narrativa del rescate animal. Creemos que cada animal merece un retrato digno y una historia contada con compasión y estilo.
          </p>
        </motion.div>
      </section>

      {/* Bento Grid: Historias Destacadas (Paso 4) */}
      <motion.section
        id="historias"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full py-12 px-5 md:px-8 max-w-[1280px] mx-auto"
      >
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display-editorial text-3xl md:text-4xl text-[#6c2f00] dark:text-[#ffb68c] font-semibold mb-2">
              Historias Destacadas
            </h2>
            <p className="font-body-editorial text-base text-[#54433a] dark:text-gray-300">
              Rescates recientes que buscan un hogar definitivo.
            </p>
          </div>
          <a
            href="#como-funciona"
            className="hidden md:flex font-body-editorial font-semibold text-[#6c2f00] dark:text-[#ffb68c] items-center gap-2 hover:opacity-70 transition-opacity"
          >
            Ver más <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[420px]">
          {/* Card Principal 1 (Spans 8 cols) */}
          <article className="md:col-span-8 group relative overflow-hidden rounded-xl border border-[#6c2f00]/15 bg-[#fff1ea] dark:bg-zinc-900 transition-all duration-500 hover:border-[#6c2f00]/30 shadow-sm min-h-[380px]">
            <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
              <Image
                src="/gato-y-amor.jpg"
                alt="El viaje de Milo hacia la paz"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#3f2c20]/90 via-[#3f2c20]/30 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 w-full z-20">
              <div className="flex gap-2 mb-4">
                <span className="bg-[#934b19] text-white px-3 py-1 rounded-sm font-body-editorial text-xs font-semibold uppercase tracking-wider">
                  Tranquilo
                </span>
                <span className="bg-[#934b19] text-white px-3 py-1 rounded-sm font-body-editorial text-xs font-semibold uppercase tracking-wider">
                  Senior
                </span>
              </div>
              <h3 className="font-display-editorial text-2xl md:text-3xl text-white mb-2 font-semibold">
                El viaje de Milo hacia la paz
              </h3>
              <p className="font-body-editorial text-white/90 line-clamp-2 max-w-xl text-sm md:text-base">
                Después de años vagando, Milo finalmente está aprendiendo lo que se siente dormir en una cama suave y despertar sin miedo.
              </p>
            </div>
          </article>

          {/* Card Secundaria 2 (Spans 4 cols) */}
          <article className="md:col-span-4 group relative overflow-hidden rounded-xl border border-[#6c2f00]/15 bg-[#fff1ea] dark:bg-zinc-900 transition-all duration-500 hover:border-[#6c2f00]/30 shadow-sm min-h-[380px]">
            <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
              <Image
                src="/pexels.jpg"
                alt="Luna: Pequeña pero feroz"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#3f2c20]/90 via-[#3f2c20]/30 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-6 w-full z-20">
              <div className="flex gap-2 mb-3">
                <span className="bg-[#934b19] text-white px-3 py-1 rounded-sm font-body-editorial text-xs font-semibold uppercase tracking-wider">
                  Juguetón
                </span>
              </div>
              <h3 className="font-display-editorial text-xl text-white mb-1 font-semibold">
                Luna: Pequeña pero feroz
              </h3>
              <p className="font-body-editorial text-white/90 line-clamp-2 text-sm">
                Una bola de energía inagotable que traerá luz (y algo de caos) a tu hogar.
              </p>
            </div>
          </article>
        </div>
      </motion.section>

      {/* Timeline público de publicaciones de las ONGs (Integrado Editorialmente - Paso 4) */}
      <section className="w-full max-w-[1280px] px-4 py-12 flex flex-col items-center">
        <div className="w-full text-center mb-8">
          <span className="material-symbols-outlined text-[#ae2f34] text-3xl mb-2">
            pets
          </span>
          <h2 className="font-display-editorial text-3xl md:text-4xl text-[#6c2f00] dark:text-[#ffb68c] font-semibold">
            Novedades de la Red de ONGs
          </h2>
          <p className="font-body-editorial text-base text-[#54433a] dark:text-gray-300 mt-2">
            Casos activos, avisos e historias compartidas en tiempo real por nuestras refugios aliados.
          </p>
        </div>
        <div className="w-full bg-[#fff1ea]/60 dark:bg-zinc-900/40 border border-[#877369]/15 p-4 md:p-8 rounded-2xl shadow-sm">
          <GlobalTimeline />
        </div>
      </section>

      {/* Cómo funciona la red (Estilo Editorial - Paso 3) */}
      <motion.section
        id="como-funciona"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[1280px] px-5 md:px-8 py-16 text-center mx-auto my-8 border-t border-[#877369]/15 dark:border-zinc-800"
      >
        <h2 className="font-display-editorial text-3xl md:text-4xl text-[#6c2f00] dark:text-[#ffb68c] font-semibold mb-12">
          Cómo funciona la red
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-xl bg-[#fff1ea] dark:bg-zinc-900/60 border border-[#877369]/15 transition-all duration-300 hover:-translate-y-1 hover:border-[#6c2f00]/30 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#ffeade] dark:bg-zinc-800 flex items-center justify-center text-[#ae2f34]">
              <FaHome className="text-2xl" />
            </div>
            <h3 className="font-display-editorial text-xl font-semibold text-[#6c2f00] dark:text-white">
              Registrá tu organización
            </h3>
            <p className="font-body-editorial text-sm text-[#54433a] dark:text-gray-300 leading-relaxed">
              Conéctate con nuestra red de apoyo y comparte tu misión con la comunidad.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-xl bg-[#fff1ea] dark:bg-zinc-900/60 border border-[#877369]/15 transition-all duration-300 hover:-translate-y-1 hover:border-[#6c2f00]/30 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#ffeade] dark:bg-zinc-800 flex items-center justify-center text-[#ae2f34]">
              <FaExclamation className="text-2xl" />
            </div>
            <h3 className="font-display-editorial text-xl font-semibold text-[#6c2f00] dark:text-white">
              Publicá casos de animales
            </h3>
            <p className="font-body-editorial text-sm text-[#54433a] dark:text-gray-300 leading-relaxed">
              Da visibilidad a animales que necesiten adopción o cuidados especiales.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-xl bg-[#fff1ea] dark:bg-zinc-900/60 border border-[#877369]/15 transition-all duration-300 hover:-translate-y-1 hover:border-[#6c2f00]/30 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#ffeade] dark:bg-zinc-800 flex items-center justify-center text-[#ae2f34]">
              <FaHandshake className="text-2xl" />
            </div>
            <h3 className="font-display-editorial text-xl font-semibold text-[#6c2f00] dark:text-white">
              Colaborá con otras ONGs
            </h3>
            <p className="font-body-editorial text-sm text-[#54433a] dark:text-gray-300 leading-relaxed">
              Construye alianzas para potenciar el impacto de cada rescate.
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
