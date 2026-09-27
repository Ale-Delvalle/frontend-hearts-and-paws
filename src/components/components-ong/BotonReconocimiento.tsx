'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useUsuarioAuth } from '@/context/UsuarioAuthContext';
import { useOngAuth } from '@/context/OngAuthContext';
import { useAuth } from '@/components/SupabaseProvider';
import {
  getMiEstadoReconocimiento,
  otorgarReconocimiento,
  revocarReconocimiento,
} from '@/services/ongProfile';
import ModalReconocimiento from './ModalReconocimiento';

interface BotonReconocimientoProps {
  ongId: string;
  nombreOng: string;
}

export default function BotonReconocimiento({ ongId, nombreOng }: BotonReconocimientoProps) {
  const { usuario } = useUsuarioAuth();
  const { ong } = useOngAuth();
  const { user } = useAuth();

  const estaAutenticado = Boolean(usuario || ong || user);
  const esMismaOng = Boolean(ong && ong.id === ongId);

  const [yaReconocida, setYaReconocida] = useState(false);
  const [cargandoEstado, setCargandoEstado] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (!estaAutenticado || esMismaOng) {
      setCargandoEstado(false);
      return;
    }

    let activo = true;
    setCargandoEstado(true);

    getMiEstadoReconocimiento(ongId)
      .then((res) => {
        if (activo) setYaReconocida(res.yaReconocida);
      })
      .catch(() => {
        /* si falla la consulta, se asume que aún no la reconoció */
      })
      .finally(() => {
        if (activo) setCargandoEstado(false);
      });

    return () => {
      activo = false;
    };
  }, [ongId, estaAutenticado, esMismaOng]);

  if (esMismaOng) {
    return null;
  }

  const handleConfirmar = async (mensaje?: string) => {
    setProcesando(true);
    try {
      await otorgarReconocimiento(ongId, mensaje);
      setYaReconocida(true);
      setMostrarModal(false);
      toast.success(`¡Reconociste a ${nombreOng}!`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al otorgar el reconocimiento.');
    } finally {
      setProcesando(false);
    }
  };

  const handleRevocar = async () => {
    setProcesando(true);
    try {
      await revocarReconocimiento(ongId);
      setYaReconocida(false);
      toast.success('Reconocimiento revocado.');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al revocar el reconocimiento.');
    } finally {
      setProcesando(false);
    }
  };

  if (!estaAutenticado) {
    return (
      <Link
        href="/login"
        className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] transition"
      >
        <span className="material-symbols-outlined text-base">verified</span>
        Iniciá sesión para reconocer a esta ONG
      </Link>
    );
  }

  if (cargandoEstado) {
    return (
      <div className="w-full h-10 rounded-full bg-[#fff1ea] dark:bg-[#26262e] animate-pulse" />
    );
  }

  return (
    <>
      {mostrarModal && (
        <ModalReconocimiento
          nombreOng={nombreOng}
          onConfirmar={handleConfirmar}
          onCancelar={() => setMostrarModal(false)}
          cargando={procesando}
        />
      )}

      {yaReconocida ? (
        <div className="w-full flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="material-symbols-outlined text-base">verified</span>
            Ya reconociste a esta ONG
          </span>
          <button
            type="button"
            onClick={handleRevocar}
            disabled={procesando}
            className="text-xs font-semibold text-[#54433a] dark:text-[#dac2b6] hover:text-[#c85a32] underline disabled:opacity-50"
          >
            Revocar reconocimiento
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setMostrarModal(true)}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold text-xs py-3 px-4 rounded-full shadow-sm transition-all duration-300"
        >
          <span className="material-symbols-outlined text-base">verified</span>
          Reconocer a esta ONG por su excelencia
        </button>
      )}
    </>
  );
}
