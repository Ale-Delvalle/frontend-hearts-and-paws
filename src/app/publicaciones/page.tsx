import type { Metadata } from 'next'
import PublicacionesPage from '@/components/publicaciones/PublicacionesPage'

export const metadata: Metadata = {
  title: 'Publicaciones | Hearts & Paws',
  description: 'Timeline de publicaciones y novedades de nuestra red de ONGs.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4]">
      <PublicacionesPage />
    </div>
  )
}
