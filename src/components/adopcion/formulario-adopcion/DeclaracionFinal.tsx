'use client';

import { FormularioAdopcionData } from '@/types/formularioadopcion';

interface Props {
  formData: FormularioAdopcionData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function DeclaracionFinal({ formData, onChange }: Props) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto font-body-editorial">
      {/* Encabezado */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#6c2f00]/10 text-[#6c2f00] dark:bg-[#c85a32]/20 dark:text-[#ffdbc9]">
          Paso 4 de 4 • Compromiso Ético y Legal
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#6c2f00] dark:text-[#ffdbc9]">
          Declaración Final
        </h2>
        <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] max-w-lg mx-auto">
          Por favor, lee con detenimiento los términos antes de enviar tu solicitud de adopción.
        </p>
      </div>

      {/* Tarjeta de Manifiesto */}
      <div className="bg-[#fff8f5] dark:bg-[#26262e] border-2 border-[#c85a32]/25 dark:border-[#ff8a65]/25 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-3 pb-3 border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
          <div className="w-10 h-10 rounded-2xl bg-[#c85a32]/10 dark:bg-[#ff8a65]/15 flex items-center justify-center text-[#c85a32] dark:text-[#ff8a65] shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-[#6c2f00] dark:text-[#ffdbc9]">
              Términos de la Solicitud
            </h3>
            <p className="text-xs text-[#85736b] dark:text-[#a08f87]">
              Adopción responsable y transparente
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="text-[#c85a32] dark:text-[#ff8a65] font-bold shrink-0 mt-0.5">•</span>
            <span>
              Declaro bajo juramento que toda la información consignada en este formulario es verdadera, verídica y comprobable.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#c85a32] dark:text-[#ff8a65] font-bold shrink-0 mt-0.5">•</span>
            <span>
              Entiendo que el envío de este formulario no garantiza la adopción automática del animal, quedando sujeta a la evaluación y criterios de la entidad protectora o rescatista.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#c85a32] dark:text-[#ff8a65] font-bold shrink-0 mt-0.5">•</span>
            <span>
              Acepto y presto mi conformidad para que la entidad protectora pueda realizar visitas o comunicaciones de seguimiento pre y/o post adopción para velar por el bienestar del animal.
            </span>
          </li>
        </ul>
      </div>

      {/* Pregunta de Aceptación */}
      <fieldset className="space-y-3 pt-2">
        <legend className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#6c2f00] dark:text-[#ffdbc9] text-center block w-full mb-2">
          ¿Aceptas y das fe de esta declaración?
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-required="true">
          {[
            { valor: 'Sí', label: 'Sí, acepto la declaración', desc: 'Doy fe de lo manifestado', isYes: true },
            { valor: 'No', label: 'No acepto', desc: 'No estoy de acuerdo con los términos', isYes: false },
          ].map((opcion) => {
            const isChecked = formData.declaracionFinal === opcion.valor;
            return (
              <label
                key={opcion.valor}
                className={`relative flex items-center justify-between p-4 rounded-2xl cursor-pointer border transition-all duration-200 ${
                  isChecked
                    ? opcion.isYes
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                    : 'bg-[#fff8f5] dark:bg-[#26262e] text-[#2d1810] dark:text-[#ffede4] border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 hover:border-[#c85a32]/50 hover:bg-white dark:hover:bg-[#2c2c36]'
                }`}
              >
                <input
                  type="radio"
                  name="declaracionFinal"
                  value={opcion.valor}
                  checked={isChecked}
                  onChange={onChange}
                  required
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'border-white bg-white/20'
                        : 'border-[#85736b] dark:border-[#a08f87]'
                    }`}
                  >
                    {isChecked && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                    )}
                  </div>
                  <div>
                    <span className="block text-sm font-bold">
                      {opcion.label}
                    </span>
                    <span
                      className={`block text-xs ${
                        isChecked
                          ? 'text-white/80'
                          : 'text-[#85736b] dark:text-[#a08f87]'
                      }`}
                    >
                      {opcion.desc}
                    </span>
                  </div>
                </div>
                <span className="text-lg">
                  {opcion.isYes ? '🐾' : '✕'}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
