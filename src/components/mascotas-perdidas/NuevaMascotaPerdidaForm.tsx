'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useUsuarioAuth } from '@/context/UsuarioAuthContext';
import { useOngAuth } from '@/context/OngAuthContext';
import { useAuth } from '../SupabaseProvider';
import { crearMascotaPerdida } from '@/services/mascotasPerdidasService';

export default function NuevaMascotaPerdidaForm() {
  const router = useRouter();
  const { usuario, loading: userLoading } = useUsuarioAuth();
  const { ong, loading: ongLoading } = useOngAuth();
  const { user } = useAuth();

  const estaAutenticado = Boolean(usuario || ong || user);
  const cargandoAuth = userLoading || ongLoading;

  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Perro');
  const [estado, setEstado] = useState<'PERDIDO' | 'ENCONTRADO'>('PERDIDO');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [contacto, setContacto] = useState('');
  const [recompensa, setRecompensa] = useState('');
  const [fechaPerdido, setFechaPerdido] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prellenar contacto si hay teléfono en perfil
  useEffect(() => {
    if (usuario?.telefono && !contacto) {
      setContacto(usuario.telefono);
    } else if (ong?.telefono && !contacto) {
      setContacto(ong.telefono);
    }
  }, [usuario, ong, contacto]);

  useEffect(() => {
    if (!archivo) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(archivo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  const handleSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen válida.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('La imagen no puede exceder 10MB.');
        return;
      }
      setArchivo(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error('Por favor ingresá el nombre o referencia de la mascota.');
      return;
    }
    if (!descripcion.trim()) {
      toast.error('Por favor describí las características de la mascota.');
      return;
    }
    if (!ubicacion.trim()) {
      toast.error('Por favor indicá dónde se perdió o fue visto.');
      return;
    }
    if (!contacto.trim()) {
      toast.error('Por favor ingresá un teléfono o contacto.');
      return;
    }

    setEnviando(true);
    try {
      const formData = new FormData();
      formData.append('nombre', nombre.trim());
      formData.append('tipo', tipo);
      formData.append('estado', estado);
      formData.append('descripcion', descripcion.trim());
      formData.append('ubicacion', ubicacion.trim());
      if (ciudad.trim()) formData.append('ciudad', ciudad.trim());
      formData.append('contacto', contacto.trim());
      if (recompensa.trim()) formData.append('recompensa', recompensa.trim());
      formData.append('fechaPerdido', fechaPerdido);
      if (archivo) formData.append('imagen', archivo);

      const res = await crearMascotaPerdida(formData);
      if (res.publicacion?.moderacion === 'PENDIENTE') {
        toast.success('Tu publicación está pendiente de aprobación. Se mostrará cuando un administrador la apruebe.', {
          duration: 6000,
        });
      } else {
        toast.success('¡Publicación creada exitosamente!');
      }
      router.push('/mascotas-perdidas');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la publicación.');
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  if (cargandoAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-[#c85a32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si no está autenticado
  if (!estaAutenticado) {
    return (
      <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] flex items-center justify-center p-6 font-body-editorial">
        <div className="max-w-md w-full bg-white dark:bg-[#1c1c21] p-8 sm:p-10 rounded-3xl shadow-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#fff1ea] dark:bg-[#2b170f] border border-[#c85a32]/25 text-[#c85a32] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>

          <h2 className="font-display-editorial text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
            Iniciá sesión para publicar
          </h2>

          <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
            Para mantener la comunidad segura y permitirte actualizar el estado cuando el animal sea encontrado, necesitás ingresar con tu cuenta de usuario u ONG.
          </p>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold text-sm py-3.5 rounded-full shadow-md transition"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/mascotas-perdidas"
              className="text-xs font-semibold text-[#54433a] dark:text-[#dac2b6] hover:text-[#c85a32]"
            >
              Volver a mascotas perdidas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial py-12 px-6 sm:px-10 lg:px-16 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Encabezado y botón volver */}
        <div className="flex items-center justify-between">
          <Link
            href="/mascotas-perdidas"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#54433a] dark:text-[#dac2b6] hover:text-[#c85a32] dark:hover:text-[#c85a32] transition group"
          >
            <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-0.5">
              arrow_back
            </span>
            <span>Volver a publicaciones</span>
          </Link>
          <span className="text-xs font-semibold text-[#c85a32] bg-[#fff1ea] dark:bg-[#26262e] px-3 py-1 rounded-full border border-[#c85a32]/20">
            {ong ? `Publicando como ONG: ${ong.nombre}` : `Publicando como: ${usuario?.nombre || 'Usuario'}`}
          </span>
        </div>

        <div className="bg-white dark:bg-[#1c1c21] rounded-3xl p-8 sm:p-10 border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 shadow-xl space-y-8">
          <div>
            <h1 className="font-display-editorial text-3xl sm:text-4xl font-bold text-[#6c2f00] dark:text-[#ffdbc9]">
              Nueva Publicación de Mascota
            </h1>
            <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] mt-1.5 leading-relaxed">
              Completá los datos clave para que la comunidad pueda reconocer a la mascota y ponerse en contacto de inmediato.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de publicación (Perdido vs Encontrado) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-2">
                Situación del animal
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEstado('PERDIDO')}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    estado === 'PERDIDO'
                      ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-950/60 dark:text-red-300 shadow-sm'
                      : 'border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#54433a] dark:text-[#dac2b6] hover:bg-[#fff1ea] dark:hover:bg-[#26262e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">search</span>
                  <span>Mascota Extraviada / Perdida</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEstado('ENCONTRADO')}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    estado === 'ENCONTRADO'
                      ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 shadow-sm'
                      : 'border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#54433a] dark:text-[#dac2b6] hover:bg-[#fff1ea] dark:hover:bg-[#26262e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">home_pin</span>
                  <span>Encontré una mascota</span>
                </button>
              </div>
            </div>

            {/* Nombre y Especie */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1.5">
                  Nombre o Referencia <span className="text-[#c85a32]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Milo, Caniche blanco, Desconocido"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9] focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1.5">
                  Especie / Tipo <span className="text-[#c85a32]">*</span>
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9] focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                >
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Ubicación y Ciudad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1.5">
                  Lugar o Barrio <span className="text-[#c85a32]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Plaza Moreno, Calle 7 y 50"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9] focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1.5">
                  Ciudad o Localidad
                </label>
                <input
                  type="text"
                  placeholder="Ej: La Plata, CABA, Rosario"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9] focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                />
              </div>
            </div>

            {/* Contacto y Recompensa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1.5">
                  Teléfono o WhatsApp de Contacto <span className="text-[#c85a32]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: +54 9 11 2345-6789"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9] focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1.5">
                  Recompensa (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: $20.000 / Se gratificará"
                  value={recompensa}
                  onChange={(e) => setRecompensa(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9] focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                />
              </div>
            </div>

            {/* Fecha en que se extravió o vio */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1.5">
                Fecha del hecho
              </label>
              <input
                type="date"
                value={fechaPerdido}
                onChange={(e) => setFechaPerdido(e.target.value)}
                className="w-full sm:w-1/2 px-4 py-3 rounded-2xl bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9] focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1.5">
                Descripción y señas particulares <span className="text-[#c85a32]">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describí color de pelaje, tamaño, collar, si está asustado/a, señas físicas, medicación o cualquier dato útil..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#fff8f5] dark:bg-[#121214] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9] focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
              />
            </div>

            {/* Foto de la mascota */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#54433a] dark:text-[#dac2b6] mb-1.5">
                Fotografía del animal (Muy recomendada)
              </label>

              <div
                onClick={() => !enviando && fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#6c2f00]/25 dark:border-[#ffdbc9]/25 hover:border-[#c85a32] dark:hover:border-[#c85a32] rounded-3xl p-6 text-center cursor-pointer bg-[#fff8f5]/60 dark:bg-[#121214]/60 transition flex flex-col items-center justify-center min-h-[160px]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSeleccionarArchivo}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-md border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                    <p className="text-xs font-semibold text-[#c85a32]">
                      Hacé clic para cambiar la foto
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-[#c85a32]">
                      add_photo_alternate
                    </span>
                    <p className="text-sm font-semibold text-[#6c2f00] dark:text-[#ffdbc9]">
                      Hacé clic para subir una foto
                    </p>
                    <p className="text-xs text-[#54433a]/70 dark:text-[#dac2b6]/70">
                      Formatos JPG, PNG, WEBP (hasta 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/mascotas-perdidas"
                className="flex-1 text-center py-3.5 px-6 rounded-full border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] font-semibold text-sm hover:bg-[#fff1ea] dark:hover:bg-[#26262e] transition"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 bg-[#c85a32] hover:bg-[#a84320] text-white font-semibold text-sm py-3.5 px-6 rounded-full shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">campaign</span>
                    <span>Publicar mascota</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
