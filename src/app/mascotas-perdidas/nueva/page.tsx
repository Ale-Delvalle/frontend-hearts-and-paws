import React from 'react';
import { Metadata } from 'next';
import NuevaMascotaPerdidaForm from '@/components/mascotas-perdidas/NuevaMascotaPerdidaForm';

export const metadata: Metadata = {
  title: 'Publicar Mascota Perdida o Encontrada | Hearts&Paws',
  description:
    'Publicá un animal extraviado o encontrado para que la comunidad ayude a que regrese con su familia.',
};

export default function NuevaMascotaPerdidaPage() {
  return <NuevaMascotaPerdidaForm />;
}
