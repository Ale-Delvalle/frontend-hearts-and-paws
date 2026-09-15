'use client'

import Link from 'next/link'

export default function AdopcionExitosaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8f5] dark:bg-[#121214] px-4 py-12 font-body-editorial transition-colors duration-300 relative overflow-hidden">
      {/* Halos decorativos de fondo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#c85a32]/10 dark:bg-[#c85a32]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#6c2f00]/10 dark:bg-[#ff8a65]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta Central */}
      <div className="relative max-w-xl w-full bg-white dark:bg-[#1c1c21] rounded-3xl border border-[#6c2f00]/15 dark:border-[#c85a32]/25 p-7 sm:p-10 shadow-2xl shadow-[#6c2f00]/5 dark:shadow-none text-center space-y-6">
        {/* Badge / Ícono de Éxito */}
        <div className="space-y-3">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#c85a32]/15 to-[#6c2f00]/10 dark:from-[#c85a32]/25 dark:to-[#ff8a65]/20 border-2 border-[#c85a32]/30 dark:border-[#ff8a65]/30 flex items-center justify-center shadow-inner">
            <span className="text-3xl sm:text-4xl" role="img" aria-label="Huella">
              🐾
            </span>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 mb-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Solicitud Registrada con Éxito
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#6c2f00] dark:text-[#ffdbc9] leading-tight">
              ¡Gracias por tu amor y compromiso!
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#54433a] dark:text-[#dac2b6] max-w-md mx-auto">
            Hemos recibido tu postulación de adopción y la entidad protectora ya fue notificada para revisarla cuidadosamente.
          </p>
        </div>

        {/* Guía de Próximos Pasos */}
        <div className="bg-[#fff8f5] dark:bg-[#26262e] border border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 rounded-2xl p-5 text-left space-y-4">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#c85a32] dark:text-[#ff8a65] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ¿Qué sucede ahora?
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#c85a32]/10 dark:bg-[#ff8a65]/15 text-[#c85a32] dark:text-[#ff8a65] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                1
              </div>
              <p className="text-[#54433a] dark:text-[#dac2b6]">
                <strong className="text-[#2d1810] dark:text-[#ffede4]">Evaluación en 24-48 horas:</strong> Recibirás un correo electrónico con novedades sobre el estado de tu solicitud.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#c85a32]/10 dark:bg-[#ff8a65]/15 text-[#c85a32] dark:text-[#ff8a65] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                2
              </div>
              <p className="text-[#54433a] dark:text-[#dac2b6]">
                <strong className="text-[#2d1810] dark:text-[#ffede4]">Contacto directo:</strong> Un representante del refugio podría llamarte o escribirte para coordinar una entrevista o visita.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#c85a32]/10 dark:bg-[#ff8a65]/15 text-[#c85a32] dark:text-[#ff8a65] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                3
              </div>
              <p className="text-[#54433a] dark:text-[#dac2b6]">
                <strong className="text-[#2d1810] dark:text-[#ffede4]">Bandeja de entrada:</strong> Recuerda verificar tu bandeja de correo no deseado o spam para no perderte ninguna notificación.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones de Navegación */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/publicaciones"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#c85a32] text-white font-semibold text-xs sm:text-sm hover:bg-[#a64522] shadow-md shadow-[#c85a32]/20 transition-all duration-200 active:scale-95"
          >
            <span>Explorar publicaciones</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#6c2f00]/10 dark:bg-white/10 text-[#6c2f00] dark:text-[#ffdbc9] font-semibold text-xs sm:text-sm hover:bg-[#6c2f00]/15 dark:hover:bg-white/15 transition-all duration-200 active:scale-95"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}