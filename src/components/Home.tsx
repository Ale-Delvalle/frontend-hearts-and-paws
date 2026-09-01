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


     {/* Sección destacada: mensaje + imagen en contenedor blanco */}
<section className="w-full px-4 py-10 flex justify-center">
  <div className="grid items-center bg-white dark:bg-zinc-900 rounded-xl shadow-md p-8 w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-8">
    
    {/* Texto */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col justify-center gap-4"
    >
      <h2 className="text-3xl font-bold leading-tight md:text-4xl text-[#FA8072]">
        Unimos fuerzas <br /> por los que no tienen voz
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        Ayudá, adoptá o colaborá con causas que salvan vidas. Nuestra red conecta corazones con patas. 🐾
      </p>
    </motion.div>

    {/* Imagen */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center"
    >
      <Image
        src="/gato-y-amor.jpg"
        alt="Perro y gato"
        width={300}
        height={300}
        className="rounded-xl"
      />
    </motion.div>
  </div>
</section>

      {/* Timeline público de publicaciones de las ONGs */}
      <section className="w-full px-4 py-10 flex justify-center">
        <GlobalTimeline />
      </section>

      {/* Cómo funciona la red */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-5xl px-4 py-16 text-center"
      >
        <h2 className="mb-10 text-2xl font-semibold md:text-3xl">Cómo funciona la red</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <FaHome className="text-4xl text-[#FA8072]" />
            <p>Registrá tu organización</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <FaExclamation className="text-4xl text-[#FA8072]" />
            <p>Publicá casos de animales que necesiten ayuda</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <FaHandshake className="text-4xl text-[#FA8072]" />
            <p>Colaborá con otras organizaciones</p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
