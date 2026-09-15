'use client';

import { FormularioAdopcionData } from '@/types/formularioadopcion';

interface Props {
  formData: FormularioAdopcionData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function Compromisos({ formData, onChange }: Props) {
  const compromisos = [
    {
      name: 'cubrirGastos',
      label: '¿Estás dispuesto/a a cubrir gastos veterinarios (vacunas, desparasitación, esterilización y emergencias)?',
      icon: 'medical_services',
    },
    {
      name: 'darAlimentoCuidados',
      label: '¿Te comprometés a brindarle alimento de calidad, agua fresca y atención diaria durante toda su vida?',
      icon: 'restaurant',
    },
    {
      name: 'darAmorTiempoEj',
      label: '¿Disponés de tiempo diario para paseos, juego, cariño y dedicación para su bienestar integral?',
      icon: 'favorite',
    },
    {
      name: 'devolucionDeMascota',
      label: 'En caso de fuerza mayor extrema donde no puedas cuidarla, ¿te comprometés a devolverla a la fundación en lugar de abandonarla o regalarla?',
      icon: 'volunteer_activism',
    },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-body-editorial">
      <div className="text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1.5">
          Compromisos y Responsabilidades
        </h2>
        <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6]">
          Adoptar es un acto de amor y compromiso a largo plazo. Por favor respondé con sinceridad.
        </p>
      </div>

      <fieldset className="space-y-4 border-0 p-0 m-0">
        {compromisos.map(({ name, label, icon }) => (
          <div
            key={name}
            className="p-4 sm:p-5 rounded-2xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="material-symbols-outlined text-xl text-[#c85a32] shrink-0 mt-0.5">
                {icon}
              </span>
              <p className="font-semibold text-xs sm:text-sm text-[#6c2f00] dark:text-[#ffdbc9] leading-snug">
                {label} <span className="text-[#c85a32]">*</span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {['Sí', 'No'].map((opcion) => {
                const seleccionado = formData[name] === opcion;
                const esSi = opcion === 'Sí';

                return (
                  <label
                    key={opcion}
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer select-none border ${
                      seleccionado
                        ? esSi
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                          : 'border-red-600 bg-red-600 text-white shadow-xs'
                        : 'border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 bg-white dark:bg-[#1c1c21] text-[#54433a] dark:text-[#dac2b6] hover:border-[#c85a32]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={name}
                      value={opcion}
                      checked={seleccionado}
                      onChange={onChange}
                      required
                      className="sr-only"
                    />
                    <span>{opcion}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Plan de contingencia */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 space-y-2">
          <label
            htmlFor="siNoPodesCuidarla"
            className="block font-semibold text-xs sm:text-sm text-[#6c2f00] dark:text-[#ffdbc9]"
          >
            ¿Qué pasaría con la mascota ante una mudanza o imprevisto mayor si no pudieras cuidarla? <span className="text-[#c85a32]">*</span>
          </label>
          <textarea
            id="siNoPodesCuidarla"
            name="siNoPodesCuidarla"
            value={formData.siNoPodesCuidarla}
            onChange={onChange}
            rows={3}
            placeholder="Explicá tu plan familiar o red de apoyo ante emergencias o cambios de residencia..."
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/20 bg-white dark:bg-[#1c1c21] text-[#2d1810] dark:text-[#ffede4] focus:outline-none focus:border-[#c85a32] focus:ring-2 focus:ring-[#c85a32]/20 transition-all resize-none"
            required
          />
        </div>
      </fieldset>
    </div>
  );
}
