'use client'

import { useState } from 'react'
import OngTimeline from './OngTimeline'
import OngMascotasCatalogo from './OngMascotasCatalogo'
import OngCasosCerrados from './OngCasosCerrados'

type Tab = 'publicaciones' | 'mascotas' | 'cerrados'

export default function OngPerfilTabs({ ongId }: { ongId: string }) {
  const [tab, setTab] = useState<Tab>('publicaciones')

  const claseTab = (activo: boolean) =>
    `px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
      activo
        ? 'bg-[#c85a32] hover:bg-[#a84320] text-white shadow-xs'
        : 'bg-white dark:bg-[#1c1c21] text-[#6c2f00] dark:text-[#ffdbc9] border border-[#6c2f00]/20 dark:border-[#c85a32]/30 hover:bg-[#ffeade] dark:hover:bg-[#26262e]'
    }`

  return (
    <div className="flex flex-col gap-6 font-body-editorial">
      <div className="flex items-center gap-3 flex-wrap">
        <button className={claseTab(tab === 'publicaciones')} onClick={() => setTab('publicaciones')}>
          <span className="material-symbols-outlined text-lg">feed</span>
          <span>Publicaciones</span>
        </button>
        <button className={claseTab(tab === 'mascotas')} onClick={() => setTab('mascotas')}>
          <span className="material-symbols-outlined text-lg">pets</span>
          <span>Mascotas</span>
        </button>
        <button className={claseTab(tab === 'cerrados')} onClick={() => setTab('cerrados')}>
          <span className="material-symbols-outlined text-lg">task_alt</span>
          <span>Casos cerrados</span>
        </button>
      </div>

      {tab === 'publicaciones' && <OngTimeline ongId={ongId} />}
      {tab === 'mascotas' && <OngMascotasCatalogo ongId={ongId} />}
      {tab === 'cerrados' && <OngCasosCerrados ongId={ongId} />}
    </div>
  )
}
