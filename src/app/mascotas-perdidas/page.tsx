import React from 'react';
import { Metadata } from 'next';
import MascotasPerdidasListado from '@/components/mascotas-perdidas/MascotasPerdidasListado';

export const metadata: Metadata = {
  title: 'Mascotas Perdidas y Encontradas | Hearts&Paws',
  description:
    'Red comunitaria para publicar y encontrar mascotas perdidas o rescatadas. Ayudemos a que cada animal vuelva a su hogar.',
};

export default function MascotasPerdidasPage() {
  return <MascotasPerdidasListado />;
}
