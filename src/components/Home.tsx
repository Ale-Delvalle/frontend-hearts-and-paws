'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import GlobalTimeline from './components-feed/GlobalTimeline';

export default function Home() {
  // Asegurar que la página Home siempre renderice en modo claro puro
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.dataset.theme = 'light';
  }, []);

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#28180d] font-body-editorial flex flex-col selection:bg-[#ff6b6b] selection:text-white">
      {/* 1. Header TopAppBar (Idéntico a la imagen de referencia) */}
      <header className="bg-[#fff8f5]/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#6c2f00]/10 w-full">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-[1280px] mx-auto">
          {/* Logo */}
          <div className="font-display-editorial text-2xl font-bold text-[#6c2f00] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6c2f00] text-2xl">pets</span>
            Hearts&amp;Paws
          </div>

          {/* Navegación central */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#historias" className="font-body-editorial text-sm font-bold text-[#6c2f00] border-b-2 border-[#6c2f00] pb-0.5">
              Historias
            </a>
            <a href="/adopciones" className="font-body-editorial text-sm text-[#54433a] hover:text-[#6c2f00] transition-colors">
              Adoptar
            </a>
            <a href="/donaciones" className="font-body-editorial text-sm text-[#54433a] hover:text-[#6c2f00] transition-colors">
              Donar
            </a>
            <a href="/ongs" className="font-body-editorial text-sm text-[#54433a] hover:text-[#6c2f00] transition-colors">
              ONGs
            </a>
          </nav>

          {/* Navegación Derecha */}
          <div className="flex items-center gap-4">
            <a href="/login" className="font-body-editorial text-sm text-[#54433a] hover:text-[#6c2f00] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded">
              <span className="material-symbols-outlined text-lg">login</span> Iniciar Sesión
            </a>
            <button className="font-body-editorial text-xs font-semibold border border-[#6c2f00]/20 text-[#6c2f00] px-4 py-2 rounded-full hover:bg-[#ffeade] transition-all cursor-pointer">
              Modo claro
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* 2. Hero Inmersivo */}
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpiJoWoSrqvFR7bQPrSWSWM5uoxBuZmi5kHPSt1aqWTpZ4KitaSj-wfRxk0pNuyudmmk-UuXtuk-8HL_6z5Ugw4qu1wdQY_dMCAbYrkxuKzwNvg3j7c7ocHgqneVSad5JG3aXJboM-CD4J4WPeFPnZCp6xkcbFYqTyhsPqQxtmF23lN27orN6BO-jZkkRdmuElCGge6kAaVXu9NLmR3UDBhyZEF97Psm-SiFzUvC4i9tyEP9rtn_Yw"
              alt="Perro golden retriever corriendo en un campo soleado"
              fill
              className="object-cover object-center scale-105 transition-transform duration-1000"
              priority
              unoptimized
            />
          </div>
          {/* Degradado inferior que funde con #fff8f5 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fff8f5] via-[#fff8f5]/25 to-black/35 z-10" />

          <div className="relative z-20 max-w-[1280px] mx-auto px-6 md:px-12 text-center flex flex-col items-center">
            <h1 className="font-display-editorial text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-white font-bold mb-6 drop-shadow-md max-w-4xl leading-[1.1]">
              Cada huella tiene una historia. Ayúdanos a escribir la siguiente.
            </h1>
            <p className="font-body-editorial text-lg md:text-xl text-white max-w-2xl mb-10 drop-shadow leading-relaxed">
              Descubre las historias de rescate más conmovedoras y únete a nuestra comunidad para cambiar vidas, una adopción a la vez.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#historias"
                className="bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-body-editorial text-sm font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">pets</span> Adoptar ahora
              </a>
              <a
                href="#como-funciona"
                className="bg-transparent border border-white text-white hover:bg-white/10 font-body-editorial text-sm font-semibold px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">favorite</span> Donar
              </a>
            </div>
          </div>
        </section>

        {/* 3. Sección Misión (Editorial Gap) */}
        <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1280px] mx-auto text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <span className="material-symbols-outlined text-[#6c2f00] text-4xl mb-6 opacity-80">
              volunteer_activism
            </span>
            <h2 className="font-display-editorial text-3xl md:text-4xl text-[#8b4513] mb-6 font-semibold">
              Unimos fuerzas por los que no tienen voz
            </h2>
            <p className="font-body-editorial text-lg md:text-xl text-[#54433a] leading-relaxed">
              Hearts&amp;Paws no es solo una plataforma; es un movimiento editorial dedicado a elevar la narrativa del rescate animal. Creemos que cada animal merece un retrato digno y una historia contada con compasión y estilo.
            </p>
          </div>
        </section>

        {/* 4. Bento Grid: Historias Destacadas */}
        <section id="historias" className="pb-24 px-6 md:px-12 max-w-[1280px] mx-auto w-full">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display-editorial text-3xl md:text-5xl text-[#6c2f00] font-bold mb-2">
                Historias Destacadas
              </h2>
              <p className="font-body-editorial text-base text-[#54433a]">
                Rescates recientes que buscan un hogar definitivo.
              </p>
            </div>
            <a
              href="#publicaciones"
              className="hidden md:flex font-body-editorial font-semibold text-sm text-[#6c2f00] items-center gap-1.5 hover:opacity-75 transition-opacity"
            >
              Ver todas las historias <span className="material-symbols-outlined text-base">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[400px]">
            {/* Card Principal 1 (8 columnas) */}
            <article className="md:col-span-8 group relative overflow-hidden rounded-xl border border-[#6c2f00]/15 bg-[#fff1ea] transition-all duration-500 hover:border-[#6c2f00]/30 shadow-sm min-h-[380px]">
              <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeEPLs9AvI-9kaxqEv2wTnh4Lzx2-6VxTOfR86UJxVC9MuQvF-pmTBspjG9Cs65FaIi5j7dGa1-XzHaXih8UJQfBhxWj2WdEESyoUzoUfxSfaed_eTNZm1zylVqqI-5UoI0tq4QOwiNTb2VxHl01OQCF5b6mfyCtsw6ILC8NQ9ReCOkQYAauq6u0efo8-ZR4247ZTqTXOmhz3PtcqeApNtxEsRlAfwj1ff_pl9v3f65_ueTLCo11QB"
                  alt="Milo mirando por la ventana"
                  fill
                  className="object-cover object-center"
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3f2c20]/90 via-[#3f2c20]/25 to-transparent z-10" />
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

            {/* Card Secundaria 2 (4 columnas) */}
            <article className="md:col-span-4 group relative overflow-hidden rounded-xl border border-[#6c2f00]/15 bg-[#fff1ea] transition-all duration-500 hover:border-[#6c2f00]/30 shadow-sm min-h-[380px]">
              <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbbcKawZFLb_hpDv_Ltu-wUXBmn0bSBiYMV0mNksKjL1ZTR0q8KnmZljAuh6mdGGXaUSx1z02wkSSxxbHAG2KQPSMlMvbdvJ7n_2Sid2aWBkYZCfupw-4GaUNJCtzuRiGr04WAl8XbAQ0QyHtuDuowHAMG4MBCo7AdamXhTj-eFuXuDqapXYbhwnsM76KRc-ByTFkynx55SPEYDrHrIkI7SNIJMsTdQjdYFmzEkTuoeFtpCU2nJlNk"
                  alt="Luna la gatita saltando"
                  fill
                  className="object-cover object-center"
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3f2c20]/90 via-[#3f2c20]/25 to-transparent z-10" />
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
        </section>

        {/* 5. Timeline de Publicaciones de las ONGs */}
        <section id="publicaciones" className="w-full py-16 px-6 md:px-12 border-t border-[#6c2f00]/10 bg-[#fff1ea]/40">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-12">
              <span className="material-symbols-outlined text-[#ae2f34] text-4xl mb-2">
                pets
              </span>
              <h2 className="font-display-editorial text-3xl md:text-4xl text-[#6c2f00] font-semibold">
                Publicaciones de la Red de ONGs
              </h2>
              <p className="font-body-editorial text-base text-[#54433a] mt-2 max-w-xl mx-auto">
                Casos activos, avisos e historias compartidas en tiempo real por nuestras organizaciones aliadas.
              </p>
            </div>

            <GlobalTimeline />
          </div>
        </section>
      </main>

      {/* 6. Footer (Idéntico a la imagen de referencia) */}
      <footer className="bg-[#fbddca] w-full py-12 px-6 md:px-12 border-t border-[#dac2b6]/40">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto gap-8">
          <div className="font-display-editorial text-2xl font-bold text-[#6c2f00] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6c2f00]">pets</span>
            Hearts&amp;Paws
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-body-editorial text-sm font-semibold text-[#54433a]">
            <a href="#" className="hover:text-[#6c2f00] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#6c2f00] transition-colors">Términos</a>
            <a href="#" className="hover:text-[#6c2f00] transition-colors">Contacto</a>
            <a href="#" className="hover:text-[#6c2f00] transition-colors">Voluntariado</a>
          </nav>
          <div className="font-body-editorial text-sm text-[#6c2f00] text-center md:text-right font-medium">
            © 2024 Hearts&amp;Paws. Cada huella cuenta una historia.
          </div>
        </div>
      </footer>
    </div>
  );
}
