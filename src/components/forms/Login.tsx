'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Si ya está logueado, redirige automáticamente al DashboardRedirect
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleLoginWithGoogle = () => {
    window.location.href = '/api/auth/login?connection=google-oauth2';
  };

  if (isLoading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Iniciar sesión</h1>

      {!user ? (
        <button
          onClick={handleLoginWithGoogle}
          className="px-4 py-2 text-white bg-[#FA8072] rounded hover:bg-[#e87366]"
        >
          Iniciar sesión con Google
        </button>
      ) : (
        <p>Redirigiendo a tu panel...</p>
      )}
    </div>
  );
}
