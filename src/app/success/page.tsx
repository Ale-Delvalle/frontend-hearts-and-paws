import DonacionExitosaPage from "@/components/donacion/DonacionExito";
import { Suspense } from "react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donación Exitosa | Hearts & Paws',
  description: 'Agradecimiento por tu colaboración en Hearts & Paws.',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fff8f5] dark:bg-[#121214]">
          <div className="w-10 h-10 border-3 border-[#c85a32]/30 border-t-[#c85a32] rounded-full animate-spin" />
        </div>
      }
    >
      <DonacionExitosaPage />
    </Suspense>
  );
}