'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { supabase } from '@/lib/supabaseClient'

type DonarModalProps = {
  visible: boolean
  onClose: () => void
  onConfirm: (monto: number) => Promise<void> | void
  meta: number
  recaudado: number
}

export default function DonarModal({
  visible,
  onClose,
  onConfirm,
  meta,
  recaudado,
}: DonarModalProps) {
  const { usuario } = useUsuarioAuth()
  const router = useRouter()
  const [monto, setMonto] = useState<number | ''>('')
  const [errorMonto, setErrorMonto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const faltante = Math.max(meta - recaudado, 0)
  const opciones = [3000, 5000, 10000]

  useEffect(() => {
    setMonto('')
    setErrorMonto(null)
    setLoading(false)
  }, [visible])

  if (!visible) return null

  const validarMonto = (valor: number) => {
    if (valor < 1000) return 'Ingresá al menos $1.000.'
    if (valor > faltante) return `Tu monto excede lo que falta ($${faltante.toLocaleString('es-AR')}).`
    return null
  }

  const handleChange = (valor: number) => {
    setMonto(valor)
    setErrorMonto(validarMonto(valor))
  }

  const handleConfirmar = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!usuario && !user) {
      toast.error('Necesitás iniciar sesión para donar.')
      router.push('/login')
      return
    }

    const montoNum = typeof monto === 'number' ? monto : 0
    const err = validarMonto(montoNum)
    if (err) {
      setErrorMonto(err)
      return
    }

    setLoading(true)
    toast.loading('Redirigiéndote al pago...')

    try {
      await onConfirm(montoNum)
    } catch {
      toast.dismiss()
      toast.error('Error al procesar la donación.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#28180d]/50 backdrop-blur-xs font-body-editorial">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-[#6c2f00]/15 overflow-hidden">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-[#6c2f00] hover:text-[#ff6b6b] transition-colors p-2 rounded-full hover:bg-[#fff8f5] cursor-pointer flex items-center justify-center z-10"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Overlay de carga */}
        {loading && (
          <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 border-4 border-[#ff6b6b] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-display-editorial text-lg font-bold text-[#6c2f00]">
              Redirigiéndote a Stripe...
            </p>
            <p className="text-xs text-[#54433a] mt-2">
              Tu donación será procesada de forma segura. No cierres ni recargues esta ventana.
            </p>
          </div>
        )}

        <h2 className="font-display-editorial text-2xl font-bold text-[#6c2f00] text-center mb-2 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-2xl text-[#ff6b6b]">favorite</span>
          Doná para ayudar
        </h2>
        <p className="text-center mb-6 text-[#54433a] text-sm">
          Faltan <strong className="text-[#6c2f00]">${faltante.toLocaleString('es-AR')}</strong> para alcanzar la meta.
        </p>

        <div className="flex gap-2 justify-center mb-5">
          {opciones.map((op) => (
            <button
              key={op}
              onClick={() => handleChange(op)}
              disabled={loading}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                monto === op
                  ? 'bg-[#ff6b6b] text-white shadow-xs'
                  : 'border border-[#6c2f00]/20 text-[#6c2f00] bg-[#fff8f5] hover:bg-[#fff1ea]'
              }`}
            >
              ${op.toLocaleString('es-AR')}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <input
            type="number"
            className="w-full px-5 py-2.5 border border-[#6c2f00]/20 bg-[#fff8f5] text-[#6c2f00] placeholder:text-[#54433a]/60 text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] transition-all"
            placeholder="Ingresar otro monto ($)"
            value={monto}
            onChange={(e) => handleChange(Number(e.target.value))}
            disabled={loading}
            min={1}
          />
          {errorMonto && (
            <p className="text-xs text-red-600 mt-1.5 text-center font-semibold">{errorMonto}</p>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirmar}
            disabled={loading || !!errorMonto || monto === ''}
            className="w-full bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-semibold text-sm px-6 py-3.5 rounded-full shadow-md transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Procesando...' : '¡Quiero Donar!'}
          </button>
        </div>
      </div>
    </div>
  )
}
