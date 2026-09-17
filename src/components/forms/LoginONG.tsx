"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOngAuth } from "../../context/OngAuthContext";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginOng() {
  const { login } = useOngAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Bloquea scroll al montar, y lo restaura al desmontar
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Para evitar que el contenido "salte" cuando se bloquea scroll (por barra de scroll desaparecida)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Por favor ingresa tu email");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("El formato del email no es válido");
      return;
    }
    if (!password) {
      toast.error("Por favor ingresa tu contraseña");
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login exitoso, redirigiendo...");
        router.push("/dashboard/ong");
      } else {
        toast.error(
          "Credenciales incorrectas. Verifique que el email ingresado corresponde al tipo de cuenta de ONG.",
          { duration: 5000 }
        );
      }
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Credenciales incorrectas. Verifique que el email ingresado corresponde al tipo de cuenta de ONG.";
      toast.error(errorMsg, { duration: 5000 });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="w-full bg-white dark:bg-[#1c1c21] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 relative font-body-editorial"
      >
        {/* Botón Volver superior */}
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#54433a] dark:text-[#dac2b6] hover:text-[#c85a32] dark:hover:text-[#c85a32] transition-colors mb-4 cursor-pointer group"
        >
          <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-0.5">arrow_back</span>
          <span>Volver a tipos de cuenta</span>
        </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff1ea] dark:bg-[#121214] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 text-[#6c2f00] dark:text-[#ffdbc9] text-xs font-semibold mb-4 mx-auto">
          <span className="material-symbols-outlined text-base">domain</span>
          Organización No Gubernamental
        </div>
        <h2 className="font-display-editorial text-3xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] tracking-tight">
          Iniciar sesión como ONG
        </h2>
      </div>

      <label className="block mb-4">
        <span className="block mb-1.5 font-semibold text-xs text-[#54433a] dark:text-[#dac2b6] uppercase tracking-wider">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-2.5 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#121214] text-[#6c2f00] dark:text-[#ffdbc9] placeholder:text-[#54433a]/60 dark:placeholder:text-[#dac2b6]/50 font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] dark:focus:ring-[#c85a32] transition-all"
          placeholder="ejemplo@correo.com"
          disabled={loading}
          required
        />
      </label>

      <label className="relative block mb-6">
        <span className="block mb-1.5 font-semibold text-xs text-[#54433a] dark:text-[#dac2b6] uppercase tracking-wider">Contraseña</span>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-2.5 pr-12 border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 bg-[#fff8f5] dark:bg-[#121214] text-[#6c2f00] dark:text-[#ffdbc9] placeholder:text-[#54433a]/60 dark:placeholder:text-[#dac2b6]/50 font-body-editorial text-sm font-semibold rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6c2f00] dark:focus:ring-[#c85a32] transition-all"
          placeholder="Tu contraseña"
          disabled={loading}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute text-[#6c2f00] dark:text-[#ffdbc9] hover:text-[#c85a32] dark:hover:text-[#c85a32] right-4 top-8 transition-colors p-1 cursor-pointer"
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial font-semibold py-3.5 px-6 rounded-full text-base transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <span className="material-symbols-outlined text-xl">domain</span>
        {loading ? "Ingresando..." : "Entrar"}
      </button>

      <div className="mt-6 text-center text-xs text-[#54433a] dark:text-[#dac2b6] font-body-editorial">
        ¿No tenés una cuenta?{" "}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-[#6c2f00] dark:text-[#ffdbc9] font-bold hover:text-[#c85a32] dark:hover:text-[#c85a32] transition-colors ml-1 underline underline-offset-2 cursor-pointer"
        >
          Registrate acá
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 text-center text-xs text-[#54433a] dark:text-[#dac2b6] font-body-editorial">
        ¿Buscás otro tipo de acceso?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-[#6c2f00] dark:text-[#ffdbc9] font-bold hover:text-[#c85a32] dark:hover:text-[#c85a32] transition-colors ml-1 underline underline-offset-2 cursor-pointer"
        >
          Cambiar tipo de cuenta
        </button>
      </div>
    </form>

    {loading && (
      <div className="fixed inset-0 z-50 bg-white/90 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center pointer-events-auto">
        <div className="flex flex-col items-center gap-4 bg-[#fff8f5] dark:bg-[#1c1c21] border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 p-8 rounded-3xl shadow-2xl max-w-xs text-center font-body-editorial">
          <div className="w-10 h-10 border-4 border-[#c85a32] border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="font-display-editorial font-bold text-lg text-[#6c2f00] dark:text-[#ffdbc9]">
              Iniciando sesión...
            </p>
            <p className="text-xs text-[#54433a] dark:text-[#dac2b6] mt-1">
              Redirigiéndote al panel de ONG, por favor aguardá.
            </p>
          </div>
        </div>
      </div>
    )}
  </>
  );
}