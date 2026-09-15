import DonacionCanceladaPage from "@/components/donacion/DonacionCancelado";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donación Cancelada | Hearts & Paws',
  description: 'Aviso sobre proceso de donación interrumpido en Hearts & Paws.',
};

export default function Page() {
  return <DonacionCanceladaPage />;
}