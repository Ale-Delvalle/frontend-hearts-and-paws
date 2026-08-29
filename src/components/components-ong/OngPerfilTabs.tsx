'use client'

import { useState } from 'react'
import OngTimeline from './OngTimeline'
import OngMascotasCatalogo from './OngMascotasCatalogo'

type Tab = 'publicaciones' | 'mascotas'

export default function OngPerfilTabs({ ongId }: { ongId: string }) {
  const [tab, setTab] = useState<Tab>('publicaciones')

  const claseTab = (activo: boolean) =>
    `px-5 py-2 rounded-full text-sm font-semibold transition ${
      activo
        ? 'bg-[#FA8072] text-white shadow'
        : 'bg-white dark:bg-zinc-900 text-[#FA8072] border border-[#FA8072] hover:bg-[#ffece8]'
    }`

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3">
        <button className={claseTab(tab === 'publicaciones')} onClick={() => setTab('publicaciones')}>
          Publicaciones
        </button>
        <button className={claseTab(tab === 'mascotas')} onClick={() => setTab('mascotas')}>
          Mascotas
        </button>
      </div>

      {tab === 'publicaciones' ? <OngTimeline ongId={ongId} /> : <OngMascotasCatalogo ongId={ongId} />}
    </div>
  )
}
