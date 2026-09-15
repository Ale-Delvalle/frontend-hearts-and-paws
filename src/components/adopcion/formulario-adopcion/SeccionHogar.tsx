'use client';

import { FormularioAdopcionData } from '@/types/formularioadopcion';

interface Props {
  formData: FormularioAdopcionData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function SeccionHogar({ formData, onChange }: Props) {
  const opcionesTipoVivienda = [
    { label: 'Casa con patio', icon: 'yard' },
    { label: 'Departamento', icon: 'apartment' },
    { label: 'Casa sin patio', icon: 'home' },
  ];

  const tiposPredefinidos = opcionesTipoVivienda.map((o) => o.label);
  const esOpcionPredefinida = tiposPredefinidos.includes(formData.tipoVivienda);

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-body-editorial">
      <div className="text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] mb-1.5">
          Sobre tu Hogar
        </h2>
        <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6]">
          Contanos sobre las características de tu espacio y con quiénes convivirá la mascota.
        </p>
      </div>

      <fieldset className="space-y-6 border-0 p-0 m-0">
        {/* Tipo de vivienda en tarjetas interactivas */}
        <div className="space-y-3">
          <label className="block font-semibold text-xs sm:text-sm text-[#6c2f00] dark:text-[#ffdbc9]">
            ¿En qué tipo de vivienda vivís? <span className="text-[#c85a32]">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {opcionesTipoVivienda.map(({ label, icon }) => {
              const seleccionado = formData.tipoVivienda === label;

              return (
                <label
                  key={label}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer text-center select-none ${
                    seleccionado
                      ? 'border-[#c85a32] bg-[#fff1ea] dark:bg-[#c85a32]/20 text-[#c85a32] dark:text-[#ffdbc9] shadow-xs font-semibold'
                      : 'border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 bg-[#fff8f5]/60 dark:bg-[#26262e]/50 text-[#54433a] dark:text-[#dac2b6] hover:border-[#c85a32]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipoVivienda"
                    value={label}
                    checked={seleccionado}
                    onChange={onChange}
                    required
                    className="sr-only"
                  />
                  <span className="material-symbols-outlined text-2xl mb-1.5 text-[#c85a32]">
                    {icon}
                  </span>
                  <span className="text-xs sm:text-sm">{label}</span>
                </label>
              );
            })}
          </div>

          <div className="pt-1">
            <input
              type="text"
              name="tipoVivienda"
              placeholder="Otro tipo de vivienda (ej. Quinta, PH, Campo)"
              value={esOpcionPredefinida ? '' : formData.tipoVivienda}
              onChange={onChange}
              disabled={esOpcionPredefinida}
              className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border transition-all ${
                esOpcionPredefinida
                  ? 'border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 bg-[#6c2f00]/5 dark:bg-[#26262e]/30 text-gray-400 cursor-not-allowed'
                  : 'border-[#c85a32] bg-[#fff8f5] dark:bg-[#26262e] text-[#2d1810] dark:text-[#ffede4] ring-2 ring-[#c85a32]/20'
              }`}
            />
          </div>
        </div>

        {/* Integrantes e Hijos en Grilla de 2 Columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block font-semibold text-xs sm:text-sm text-[#6c2f00] dark:text-[#ffdbc9]">
              Integrantes en la familia <span className="text-[#c85a32]">*</span>
            </label>
            <input
              type="number"
              name="integrantesFlia"
              min={1}
              value={formData.integrantesFlia}
              onChange={onChange}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#26262e] text-[#2d1810] dark:text-[#ffede4] focus:outline-none focus:border-[#c85a32] focus:ring-2 focus:ring-[#c85a32]/20 transition-all"
              required
            />
            <p className="text-[11px] text-[#877369] dark:text-[#dac2b6]/70">
              Incluyéndote a vos (mínimo 1 persona)
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-xs sm:text-sm text-[#6c2f00] dark:text-[#ffdbc9]">
              ¿Cuántos hijos o menores conviven? <span className="text-[#c85a32]">*</span>
            </label>
            <input
              type="number"
              name="hijos"
              min={0}
              value={formData.hijos}
              onChange={onChange}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#26262e] text-[#2d1810] dark:text-[#ffede4] focus:outline-none focus:border-[#c85a32] focus:ring-2 focus:ring-[#c85a32]/20 transition-all"
              required
            />
            <p className="text-[11px] text-[#877369] dark:text-[#dac2b6]/70">
              Ingresá 0 si no conviven menores
            </p>
          </div>
        </div>

        {/* Otras Mascotas */}
        <div className="space-y-2 p-4 rounded-2xl bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15">
          <label className="block font-semibold text-xs sm:text-sm text-[#6c2f00] dark:text-[#ffdbc9]">
            ¿Cuántas otras mascotas viven actualmente en tu hogar? <span className="text-[#c85a32]">*</span>
          </label>
          <input
            type="number"
            name="hayOtrasMascotas"
            min={0}
            value={formData.hayOtrasMascotas ?? 0}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/20 bg-white dark:bg-[#1c1c21] text-[#2d1810] dark:text-[#ffede4] focus:outline-none focus:border-[#c85a32] focus:ring-2 focus:ring-[#c85a32]/20 transition-all"
            required
          />

          {formData.hayOtrasMascotas > 0 && (
            <div className="pt-2 space-y-1.5">
              <label className="block text-xs font-semibold text-[#6c2f00] dark:text-[#ffdbc9]">
                Detalle de las mascotas actuales:
              </label>
              <textarea
                name="descripcionOtrasMascotas"
                placeholder="Especificá especie, raza, edad aproximada y si están vacunadas y esterilizadas..."
                value={formData.descripcionOtrasMascotas || ''}
                onChange={onChange}
                rows={3}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/20 bg-white dark:bg-[#1c1c21] text-[#2d1810] dark:text-[#ffede4] focus:outline-none focus:border-[#c85a32] focus:ring-2 focus:ring-[#c85a32]/20 transition-all resize-none"
                required
              />
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
}
