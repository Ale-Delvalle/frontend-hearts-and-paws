import React from 'react';
import { Metadata } from 'next';
import MascotaPerdidaDetalle from '@/components/mascotas-perdidas/MascotaPerdidaDetalle';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Mascota Perdida #${id} | Hearts&Paws`,
    description:
      'Información completa sobre esta publicación de mascota perdida o encontrada. Contactá al autor y ayudá a que vuelva a su hogar.',
  };
}

export default async function MascotaPerdidaDetallePage({ params }: Props) {
  const { id } = await params;
  return <MascotaPerdidaDetalle id={id} />;
}
