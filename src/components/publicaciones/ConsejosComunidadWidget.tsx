'use client'

import Link from 'next/link'

export default function ConsejosComunidadWidget() {
  return (
    <div className="bg-white dark:bg-[#1c1c21] rounded-2xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-5 shadow-sm font-body-editorial space-y-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#c85a32] text-xl">lightbulb</span>
        <h4 className="font-serif font-bold text-sm text-[#6c2f00] dark:text-[#ffdbc9] uppercase tracking-wider">
          Consejos de la Red
        </h4>
      </div>

      <div className="p-3.5 rounded-xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#c85a32]/20">
        <p className="text-xs font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-[#a84320] dark:text-[#c85a32]">home</span>
          Adaptación en el Hogar
        </p>
        <p className="text-xs text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
          Los primeros días requieren paciencia, un espacio tranquilo y rutinas estables para que tu nuevo compañero gane confianza.
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#c85a32]/20">
        <p className="text-xs font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-[#a84320] dark:text-[#c85a32]">verified_user</span>
          Donaciones Seguras
        </p>
        <p className="text-xs text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
          Cada aporte se destina 100% a la atención veterinaria, alimentación y refugio de los casos verificados por nuestras ONGs.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between text-xs font-semibold">
        <Link
          href="/donacion"
          className="text-[#c85a32] hover:text-[#a84320] dark:hover:text-[#ffdbc9] transition flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">favorite</span>
          Donar ahora
        </Link>
        <Link
          href="/adoptar/adopcion"
          className="text-[#54433a] dark:text-[#dac2b6] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] transition flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">pets</span>
          Adoptar
        </Link>
      </div>
    </div>
  )
}
