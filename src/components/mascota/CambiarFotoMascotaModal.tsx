'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { cambiarFotoMascota } from '@/services/pet';

interface CambiarFotoMascotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mascotaId: string;
  nombreMascota: string;
  fotoActualUrl?: string;
  onFotoActualizada?: (nuevaUrl: string) => void;
}

export default function CambiarFotoMascotaModal({
  isOpen,
  onClose,
  mascotaId,
  nombreMascota,
  fotoActualUrl,
  onFotoActualizada,
}: CambiarFotoMascotaModalProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setArchivo(null);
      setPreviewUrl(null);
      setGuardando(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!archivo) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(archivo);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [archivo]);

  // Cierre con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecciona un archivo de imagen válido.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 10MB.');
        return;
      }
      setArchivo(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      toast.error('Por favor selecciona una nueva foto para la mascota.');
      return;
    }

    setGuardando(true);
    try {
      const res = await cambiarFotoMascota(mascotaId, archivo);
      toast.success('¡Foto de la mascota actualizada exitosamente!');
      if (onFotoActualizada && res?.imagen?.url) {
        onFotoActualizada(res.imagen.url);
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar la foto de la mascota.');
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-body-editorial transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1c1c21] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 overflow-hidden text-[#1c1c21] dark:text-[#ffede4] transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          disabled={guardando}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-[#6c2f00] dark:text-[#ffdbc9] hover:text-[#c85a32] dark:hover:text-[#c85a32] transition-colors p-2 rounded-full hover:bg-[#fff8f5] dark:hover:bg-[#26262e] cursor-pointer flex items-center justify-center z-10"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Encabezado */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#fff1ea] dark:bg-[#2b170f] border border-[#c85a32]/25 text-[#c85a32] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="material-symbols-outlined text-3xl">photo_camera</span>
          </div>
          <h3 className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
            Cambiar foto de {nombreMascota}
          </h3>
          <p className="text-xs text-[#54433a] dark:text-[#dac2b6] mt-1">
            Subí una imagen clara y actualizada de la mascota para su perfil público y publicaciones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Zona de previsualización o selector */}
          <div
            onClick={() => !guardando && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px] ${
              previewUrl
                ? 'border-[#c85a32] bg-[#fff8f5] dark:bg-[#121214]'
                : 'border-[#6c2f00]/25 dark:border-[#ffdbc9]/25 hover:border-[#c85a32] dark:hover:border-[#c85a32] bg-[#fff8f5]/60 dark:bg-[#121214]/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSeleccionarArchivo}
              disabled={guardando}
              className="hidden"
            />

            {previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-md border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15">
                  <Image
                    src={previewUrl}
                    alt="Previsualización"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs font-semibold text-[#c85a32] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">cached</span>
                  Hacé clic para elegir otra imagen
                </p>
              </div>
            ) : fotoActualUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden opacity-70 grayscale-[30%] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15">
                  <Image
                    src={fotoActualUrl}
                    alt="Foto actual"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <span className="material-symbols-outlined text-3xl text-[#c85a32] mb-1">
                    cloud_upload
                  </span>
                  <p className="text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9]">
                    Hacé clic para seleccionar una nueva foto
                  </p>
                  <p className="text-[11px] text-[#54433a]/70 dark:text-[#dac2b6]/70 mt-0.5">
                    Formatos JPG, PNG o WEBP (máx. 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-[#c85a32]">
                  cloud_upload
                </span>
                <p className="text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9]">
                  Hacé clic para subir una foto
                </p>
                <p className="text-xs text-[#54433a]/70 dark:text-[#dac2b6]/70">
                  Formatos recomendados: JPG, PNG, WEBP (hasta 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="flex-1 px-5 py-3 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] hover:bg-[#fff1ea] dark:hover:bg-[#26262e] font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !archivo}
              className="flex-1 bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold text-sm px-5 py-3 rounded-full shadow-md transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {guardando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Subiendo foto...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>Guardar nueva foto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
