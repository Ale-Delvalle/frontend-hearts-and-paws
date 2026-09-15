'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

import DatosPersonales from './DatosPersonales'
import SeccionHogar from './SeccionHogar'
import Compromisos from './Compromisos'
import DeclaracionFinal from './DeclaracionFinal'

import { FormularioAdopcionData } from '@/types/formularioadopcion'
import { enviarSolicitudAdopcion, obtenerCasoAdopcionId } from '@/services/adopcion'
import { useAuth } from '../../SupabaseProvider';


function pasoValido(paso: number, formData: FormularioAdopcionData): boolean {
  switch (paso) {
    case 1:
      return (
        formData.tipoVivienda.trim() !== '' &&
        formData.integrantesFlia > 0 &&
        formData.hijos >= 0 &&
        formData.hayOtrasMascotas >= 0 &&
        (formData.hayOtrasMascotas === 0 ||
          (formData.descripcionOtrasMascotas?.trim() || '') !== '')
      )
    case 2:
      return (
        formData.cubrirGastos === 'Sí' &&
        formData.darAlimentoCuidados === 'Sí' &&
        formData.darAmorTiempoEj === 'Sí' &&
        formData.devolucionDeMascota === 'Sí' &&
        (formData.siNoPodesCuidarla?.trim() || '') !== ''
      )
    case 3:
      return true
    case 4:
      return formData.declaracionFinal === 'Sí'
    default:
      return false
  }
}

export default function FormularioAdopcionPage() {
  const [paso, setPaso] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token } = useAuth();



  const [casoId, setCasoId] = useState('')
  const [formData, setFormData] = useState<FormularioAdopcionData>({
    casoAdopcionId: '',
    tipoVivienda: '',
    integrantesFlia: 0,
    hijos: 0,
    hayOtrasMascotas: 0,
    descripcionOtrasMascotas: '',
    cubrirGastos: '',
    darAlimentoCuidados: '',
    darAmorTiempoEj: '',
    devolucionDeMascota: '',
    siNoPodesCuidarla: '',
    declaracionFinal: '',
  })

  

useEffect(() => {
  const casoParam = searchParams?.get('id') || '';
  setCasoId(casoParam);

}, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (
      name === 'hayOtrasMascotas' ||
      name === 'integrantesFlia' ||
      name === 'hijos'
    ) {
      const min = name === 'integrantesFlia' ? 1 : 0
      const num = Number(value)
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(num) || num < min ? min : num,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const avanzarPaso = () => {
    if (!pasoValido(paso, formData)) {
      toast.error('Por favor, completá todos los campos obligatorios.')
      return
    }
    setPaso((prev) => prev + 1)
  }

  const enviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault()
    

    if (!pasoValido(paso, formData)) {
      toast.error('Debes completar correctamente este paso.')
      return
    }

    


    try {
      const casoAdopcionId = await obtenerCasoAdopcionId(casoId)

     await enviarSolicitudAdopcion({ ...formData, casoAdopcionId }, casoAdopcionId, token);


      toast.success('¡Solicitud enviada con éxito!')
      router.push('/adoptar/usuario-adopcion-exitoso')
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes('no puede enviar mas de 1 solicitud')
      ) {
       // toast.error('Ya has enviado una solicitud para este caso.')

        setTimeout(() => {
          router.push('/adoptar/adopcion')
        }, 2000)

        return
      }

      toast.error('Ya has enviado una solicitud para este caso.')
    }
  }

  const pasos = [
    <SeccionHogar key="paso1" formData={formData} onChange={handleChange} />,
    <Compromisos key="paso2" formData={formData} onChange={handleChange} />,
    <div key="paso3" className="space-y-6">
      <DatosPersonales />
    </div>,
    <DeclaracionFinal key="paso4" formData={formData} onChange={handleChange} />,
  ]

  const nombresPasos = [
    { num: 1, titulo: 'Tu Hogar', icon: 'home' },
    { num: 2, titulo: 'Compromisos', icon: 'handshake' },
    { num: 3, titulo: 'Tus Datos', icon: 'badge' },
    { num: 4, titulo: 'Declaración', icon: 'verified' },
  ]

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial py-10 sm:py-16 px-4 sm:px-6 flex flex-col items-center justify-start selection:bg-[#c85a32] selection:text-white">
      {/* Encabezado editorial */}
      <div className="w-full max-w-3xl mb-8 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#fff1ea] dark:bg-[#26262e] text-[#c85a32] border border-[#6c2f00]/10 dark:border-[#c85a32]/20 mb-1 shadow-xs">
          <span className="material-symbols-outlined text-2xl">pets</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] tracking-tight">
          Solicitud de Adopción Responsable
        </h1>
        <p className="text-sm sm:text-base text-[#54433a] dark:text-[#dac2b6] max-w-xl mx-auto leading-relaxed">
          Completá este formulario para que la organización pueda evaluar tu postulación y coordinar una adopción segura y consciente.
        </p>
      </div>

      <form
        className="w-full max-w-3xl space-y-8 bg-white dark:bg-[#1c1c21] p-6 sm:p-10 rounded-3xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 shadow-xl transition-all"
        onSubmit={enviarFormulario}
      >
        {/* Stepper moderno de 4 Pasos */}
        <div className="relative mb-8 select-none">
          <div className="grid grid-cols-4 gap-2">
            {nombresPasos.map((item) => {
              const estaActivo = paso === item.num
              const estaCompletado = paso > item.num

              return (
                <div key={item.num} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 font-bold text-sm ${
                      estaActivo
                        ? 'border-[#c85a32] bg-[#c85a32] text-white shadow-sm ring-4 ring-[#c85a32]/20 scale-105'
                        : estaCompletado
                        ? 'border-[#c85a32] bg-[#fff1ea] dark:bg-[#26262e] text-[#c85a32]'
                        : 'border-[#6c2f00]/15 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#1c1c21] text-[#877369] dark:text-[#dac2b6]/60'
                    }`}
                  >
                    {estaCompletado ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : (
                      item.num
                    )}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                      estaActivo
                        ? 'text-[#c85a32] dark:text-[#ffdbc9]'
                        : estaCompletado
                        ? 'text-[#6c2f00] dark:text-[#dac2b6]'
                        : 'text-[#877369] dark:text-[#dac2b6]/60'
                    }`}
                  >
                    {item.titulo}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contenido del paso activo */}
        <div className="min-h-[280px]">{pasos[paso - 1]}</div>

        {/* Botones de navegación con estilo editorial */}
        <div className="flex justify-between items-center pt-6 border-t border-[#6c2f00]/10 dark:border-[#c85a32]/15 gap-3 flex-wrap">
          <div>
            {paso > 1 && (
              <button
                type="button"
                onClick={() => setPaso((prev) => prev - 1)}
                className="px-5 sm:px-6 py-2.5 sm:py-3 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] bg-white dark:bg-[#26262e] rounded-full text-xs sm:text-sm font-semibold hover:bg-[#fff1ea] dark:hover:bg-[#34343d] transition-all cursor-pointer shadow-xs active:scale-95 inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Atrás</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {paso === 3 && (
              <button
                type="button"
                onClick={() => router.push('/dashboard/usuario')}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#fff1ea] dark:bg-[#26262e] text-[#c85a32] dark:text-[#ffdbc9] border border-[#c85a32]/30 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#ffeade] dark:hover:bg-[#34343d] transition-all cursor-pointer shadow-xs active:scale-95 inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Editar mis datos</span>
              </button>
            )}

            {paso < pasos.length ? (
              <button
                type="button"
                onClick={avanzarPaso}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md inline-flex items-center gap-2 active:scale-95 cursor-pointer ${
                  pasoValido(paso, formData)
                    ? 'bg-[#c85a32] hover:bg-[#a84320] text-white hover:scale-102'
                    : 'bg-[#c85a32]/40 text-white/80 cursor-not-allowed'
                }`}
                disabled={!pasoValido(paso, formData)}
              >
                <span>Siguiente</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            ) : (
              <button
                type="submit"
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md inline-flex items-center gap-2 active:scale-95 cursor-pointer ${
                  pasoValido(paso, formData)
                    ? 'bg-[#c85a32] hover:bg-[#a84320] text-white hover:scale-102'
                    : 'bg-[#c85a32]/40 text-white/80 cursor-not-allowed'
                }`}
                disabled={!pasoValido(paso, formData)}
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Enviar solicitud</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
