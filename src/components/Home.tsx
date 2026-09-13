'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SuccessStory {
  id: string;
  animalName: string;
  species: string;
  ongName: string;
  tag: string;
  obstacle: string;
  result: string;
  imageUrl: string;
  imageAlt: string;
  adoptedYear: string;
}

const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: '1',
    animalName: 'Milo',
    species: 'Perro',
    ongName: 'Fundación Patitas Suaves',
    tag: 'Rehabilitación y Adopción',
    obstacle: 'Fue rescatado en la vía pública con alto grado de desnutrición y desconfianza profunda hacia los humanos.',
    result: 'Tras 6 meses de cuidados médicos y contención, Milo recuperó su vitalidad y hoy vive feliz y amado en su hogar definitivo.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeEPLs9AvI-9kaxqEv2wTnh4Lzx2-6VxTOfR86UJxVC9MuQvF-pmTBspjG9Cs65FaIi5j7dGa1-XzHaXih8UJQfBhxWj2WdEESyoUzoUfxSfaed_eTNZm1zylVqqI-5UoI0tq4QOwiNTb2VxHl01OQCF5b6mfyCtsw6ILC8NQ9ReCOkQYAauq6u0efo8-ZR4247ZTqTXOmhz3PtcqeApNtxEsRlAfwj1ff_pl9v3f65_ueTLCo11QB',
    imageAlt: 'Milo sonriendo feliz en su nuevo hogar',
    adoptedYear: '2024',
  },
  {
    id: '2',
    animalName: 'Luna',
    species: 'Gata',
    ongName: 'Rescatistas Unidos',
    tag: 'Final Feliz',
    obstacle: 'Encontrada siendo apenas una cachorrita con una lesión articular severa que le impedía caminar con normalidad.',
    result: 'Recibió cirugía correctiva y fisioterapia intensiva. Hoy Luna corre, salta y llena de alegría a su familia adoptiva.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbbcKawZFLb_hpDv_Ltu-wUXBmn0bSBiYMV0mNksKjL1ZTR0q8KnmZljAuh6mdGGXaUSx1z02wkSSxxbHAG2KQPSMlMvbdvJ7n_2Sid2aWBkYZCfupw-4GaUNJCtzuRiGr04WAl8XbAQ0QyHtuDuowHAMG4MBCo7AdamXhTj-eFuXuDqapXYbhwnsM76KRc-ByTFkynx55SPEYDrHrIkI7SNIJMsTdQjdYFmzEkTuoeFtpCU2nJlNk',
    imageAlt: 'Luna jugando llena de energía',
    adoptedYear: '2024',
  },
  {
    id: '3',
    animalName: 'Oliver & Mateo',
    species: 'Perros',
    ongName: 'Refugio Huellitas de Amor',
    tag: 'Adopción Conjunta',
    obstacle: 'Dos hermanos inseparables que sufrieron abandono y necesitaban una familia dispuesta a no separarlos nunca.',
    result: 'Una familia compasiva los adoptó juntos. Hoy disfrutan paseos al aire libre y una vida llena de mimos.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpiJoWoSrqvFR7bQPrSWSWM5uoxBuZmi5kHPSt1aqWTpZ4KitaSj-wfRxk0pNuyudmmk-UuXtuk-8HL_6z5Ugw4qu1wdQY_dMCAbYrkxuKzwNvg3j7c7ocHgqneVSad5JG3aXJboM-CD4J4WPeFPnZCp6xkcbFYqTyhsPqQxtmF23lN27orN6BO-jZkkRdmuElCGge6kAaVXu9NLmR3UDBhyZEF97Psm-SiFzUvC4i9tyEP9rtn_Yw',
    imageAlt: 'Oliver y Mateo corriendo juntos felices en un parque',
    adoptedYear: '2023',
  },
];

export default function Home() {
  // Estado del carrusel de Historias de éxito
  const [stories, setStories] = useState<SuccessStory[]>(SUCCESS_STORIES);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Seleccionar historias de manera aleatoria al cargar la página
  useEffect(() => {
    const shuffled = [...SUCCESS_STORIES].sort(() => Math.random() - 0.5);
    setStories(shuffled);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleShuffle = () => {
    const shuffled = [...stories].sort(() => Math.random() - 0.5);
    setStories(shuffled);
    setCurrentIndex(0);
  };

  const currentStory = stories[currentIndex] || SUCCESS_STORIES[0];

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial flex flex-col selection:bg-[#c85a32] selection:text-white">


      {/* Main Content */}
      <main className="flex-grow">
        {/* 2. Hero Inmersivo */}
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/portada.jpg"
              alt="Imagen de portada Hearts & Paws"
              fill
              className="object-cover object-center scale-105 transition-transform duration-1000"
              priority
            />
          </div>
          {/* Degradado inferior que funde con el fondo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fff8f5] dark:from-[#121214] via-[#fff8f5]/25 dark:via-[#121214]/25 to-black/35 z-10" />

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
                className="bg-[#c85a32] hover:bg-[#a84320] !text-white text-white font-body-editorial text-sm font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg !text-white text-white">pets</span> Adoptar ahora
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
            <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#c85a32] text-4xl mb-6 opacity-90">
              volunteer_activism
            </span>
            <h2 className="font-display-editorial text-3xl md:text-4xl text-[#8b4513] dark:text-[#ffdbc9] mb-6 font-semibold">
              Unimos fuerzas por los que no tienen voz
            </h2>
            <p className="font-body-editorial text-lg md:text-xl text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
              Hearts&amp;Paws no es solo una plataforma; es un movimiento editorial dedicado a elevar la narrativa del rescate animal. Creemos que cada animal merece un retrato digno y una historia contada con compasión y estilo.
            </p>
          </div>
        </section>

        {/* 4. Carrusel: Historias de éxito */}
        <section id="historias" className="pb-24 px-6 md:px-12 max-w-[1280px] mx-auto w-full">
          {/* Encabezado de la sección */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#a84320] dark:text-[#c85a32] text-sm font-semibold uppercase tracking-wider mb-2 font-body-editorial">
                <span className="material-symbols-outlined text-lg">verified</span>
                Casos Reales Seleccionados por ONGs
              </div>
              <h2 className="font-display-editorial text-3xl md:text-5xl text-[#6c2f00] dark:text-[#ffdbc9] font-bold mb-2">
                Historias de éxito
              </h2>
              <p className="font-body-editorial text-base text-[#54433a] dark:text-[#dac2b6]">
                Transformaciones inspiradoras que demuestran que el amor y la dedicación cambian vidas.
              </p>
            </div>

            {/* Controles superiores */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShuffle}
                title="Mostrar historias en orden aleatorio"
                className="flex items-center gap-2 border border-[#6c2f00]/20 dark:border-[#c85a32]/30 bg-[#fff1ea] dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#ffeade] dark:hover:bg-[#c85a32] dark:hover:text-white px-4 py-2 rounded-full font-body-editorial text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 group"
              >
                <span className="material-symbols-outlined text-base text-[#a84320] dark:text-[#c85a32] group-hover:text-white">shuffle</span>
                <span>Mezclar historias</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Historia anterior"
                  className="w-10 h-10 rounded-full border border-[#6c2f00]/20 dark:border-[#c85a32]/30 bg-[#fff1ea] dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#6c2f00] dark:hover:bg-[#c85a32] hover:text-white dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Siguiente historia"
                  className="w-10 h-10 rounded-full border border-[#6c2f00]/20 dark:border-[#c85a32]/30 bg-[#fff1ea] dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#6c2f00] dark:hover:bg-[#c85a32] hover:text-white dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta del Carrusel de Historia de Éxito */}
          <div className="relative overflow-hidden rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 bg-[#fff1ea] dark:bg-[#1c1c21] shadow-md hover:shadow-lg transition-all duration-500">
            <div key={currentStory.id} className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] transition-all duration-500 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Columna de Texto/Detalles (7 columnas) */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10">
                <div>
                  {/* Fila ONG & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-[#6c2f00]/10 dark:bg-[#c85a32]/15 px-3.5 py-1.5 rounded-full text-[#6c2f00] dark:text-[#ffdbc9] font-body-editorial text-xs font-bold shadow-xs border border-transparent dark:border-[#c85a32]/20">
                      <span className="material-symbols-outlined text-base text-[#a84320] dark:text-[#c85a32]">pets</span>
                      {currentStory.ongName}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#a84320] text-white px-3 py-1 rounded-full font-body-editorial text-xs font-semibold uppercase tracking-wider shadow-xs">
                        {currentStory.tag}
                      </span>
                      <span className="bg-[#6c2f00]/10 dark:bg-[#c85a32]/15 text-[#6c2f00] dark:text-[#ffdbc9] px-3 py-1 rounded-full font-body-editorial text-xs font-semibold border border-transparent dark:border-[#c85a32]/20">
                        Adoptado en {currentStory.adoptedYear}
                      </span>
                    </div>
                  </div>

                  {/* Nombre del animal */}
                  <h3 className="font-display-editorial text-3xl sm:text-4xl text-[#6c2f00] dark:text-[#ffdbc9] font-bold mb-6 tracking-tight">
                    La nueva vida de {currentStory.animalName}
                  </h3>

                  {/* Bloques de Obstáculo y Resultado Final */}
                  <div className="space-y-4 mb-8">
                    {/* Obstáculo */}
                    <div className="p-4 rounded-xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#c85a32]/20 shadow-xs hover:border-[#6c2f00]/20 dark:hover:border-[#c85a32]/40 transition-colors">
                      <div className="flex items-center gap-2 text-[#934b19] dark:text-[#e06b3f] font-semibold text-sm mb-1 font-body-editorial">
                        <span className="material-symbols-outlined text-lg">healing</span>
                        El Obstáculo Inicial:
                      </div>
                      <p className="font-body-editorial text-sm sm:text-base text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
                        {currentStory.obstacle}
                      </p>
                    </div>

                    {/* Resultado Final */}
                    <div className="p-4 rounded-xl bg-[#2e5d32]/10 dark:bg-[#142618]/70 border border-[#2e5d32]/20 dark:border-[#2e5d32]/40 shadow-xs hover:border-[#2e5d32]/40 dark:hover:border-[#2e5d32]/60 transition-colors">
                      <div className="flex items-center gap-2 text-[#2e5d32] dark:text-[#86efac] font-semibold text-sm mb-1 font-body-editorial">
                        <span className="material-symbols-outlined text-lg">workspace_premium</span>
                        El Resultado Final:
                      </div>
                      <p className="font-body-editorial text-sm sm:text-base text-[#1c1c21] dark:text-[#f0fdf4] font-medium leading-relaxed">
                        {currentStory.result}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer de la Tarjeta y Paginación */}
                <div className="flex items-center justify-between pt-4 border-t border-[#6c2f00]/10 dark:border-[#c85a32]/20">
                  <div className="flex items-center gap-2 text-xs text-[#54433a] dark:text-[#dac2b6] font-semibold">
                    <span className="material-symbols-outlined text-base text-[#a84320] dark:text-[#c85a32]">favorite</span>
                    Caso {currentIndex + 1} de {stories.length}
                  </div>

                  {/* Puntos de Navegación Directa */}
                  <div className="flex items-center gap-2">
                    {stories.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Ir a historia ${idx + 1}`}
                        title={`Ver historia ${idx + 1}`}
                        className={`transition-all duration-300 cursor-pointer rounded-full ${
                          idx === currentIndex
                            ? 'w-7 h-2.5 bg-[#6c2f00] dark:bg-[#c85a32]'
                            : 'w-2.5 h-2.5 bg-[#6c2f00]/30 dark:bg-[#c85a32]/30 hover:bg-[#6c2f00]/60 dark:hover:bg-[#c85a32]/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna de Imagen del Animal Feliz (5 columnas) */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden bg-[#6c2f00]/5 dark:bg-white/5 group">
                <Image
                  src={currentStory.imageUrl}
                  alt={currentStory.imageAlt}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-[#1c1c21]/95 border border-transparent dark:border-[#c85a32]/30 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-[#2e5d32] dark:text-[#86efac] font-body-editorial text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">sentiment_very_satisfied</span>
                  Rehabilitado &amp; Feliz
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer (Idéntico a la imagen de referencia) */}
      <footer className="bg-[#fbddca] dark:bg-[#0d0d0f] w-full py-12 px-6 md:px-12 border-t border-[#dac2b6]/40 dark:border-[#c85a32]/20 text-[#1c1c21] dark:text-[#ffede4]">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto gap-8">
          <div className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#c85a32]">pets</span>
            Hearts&amp;Paws
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-body-editorial text-sm font-semibold text-[#54433a] dark:text-[#dac2b6]">
            <a href="#" className="hover:text-[#6c2f00] dark:hover:text-[#c85a32] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#6c2f00] dark:hover:text-[#c85a32] transition-colors">Términos</a>
            <a href="#" className="hover:text-[#6c2f00] dark:hover:text-[#c85a32] transition-colors">Contacto</a>
            <a href="#" className="hover:text-[#6c2f00] dark:hover:text-[#c85a32] transition-colors">Voluntariado</a>
          </nav>
          <div className="font-body-editorial text-sm text-[#6c2f00] dark:text-[#dac2b6] text-center md:text-right font-medium">
            © 2024 Hearts&amp;Paws. Cada huella cuenta una historia.
          </div>
        </div>
      </footer>
    </div>
  );
}
