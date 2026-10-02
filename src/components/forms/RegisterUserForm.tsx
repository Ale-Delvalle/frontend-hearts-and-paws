'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import FormBase from '@/components/forms/FormBase';
import { useUsuarioAuth } from '@/context/UsuarioAuthContext';
import { RegisterData } from '@/types/user';
import { verificarEmailUsuario } from '@/services/register';

export default function RegisterUserForm() {
  const { registerUser } = useUsuarioAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',
    email: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    genero: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const campos: {
    name: keyof RegisterData;
    label: string;
    type?: string;
    options?: { value: string; label: string }[];
  }[] = [
    { name: 'nombre', label: 'Nombre' },
    {
      name: 'genero',
      label: 'Sexo',
      options: [
        { value: 'FEMENINO', label: 'Femenino' },
        { value: 'MASCULINO', label: 'Masculino' },
      ],
    },
    { name: 'email', label: 'Correo electrónico', type: 'email' },
    { name: 'contrasena', label: 'Contraseña', type: 'password' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'direccion', label: 'Dirección' },
    { name: 'ciudad', label: 'Ciudad' },
    { name: 'pais', label: 'País' },
  ];

  const validarCampo = (name: keyof RegisterData, value: string): string => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) error = 'Email requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email inválido';
        break;
      case 'contrasena':
        if (!value) error = 'Contraseña requerida';
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value)) {
          error = 'Debe tener 8 caracteres, mayúscula, número y símbolo';
        }
        break;
      default:
        if (!value.trim()) error = `Campo ${name} requerido`;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validarCampo(name as keyof RegisterData, value);
    console.log(error);
    // Validación adicional para el email
    if (name === 'email') {
      const esFormatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!value || !esFormatoValido) return;

      try {
        const { existe } = await verificarEmailUsuario(value);
        if (existe) {
          setErrors((prev) => ({
            ...prev,
            email: 'Este correo ya está registrado',
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            email: '',
          }));
        }
      } catch (err) {
        // Si falla el servicio, podrías mostrar un error genérico (opcional)
        console.error('Error al verificar email', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hayErrores = false;
    const nuevosErrores: Partial<Record<keyof RegisterData, string>> = {};

    for (const [key, value] of Object.entries(formData)) {
      const error = validarCampo(key as keyof RegisterData, value);
      if (error) {
        nuevosErrores[key as keyof RegisterData] = error;
        hayErrores = true;
      }
    }

    // Verificar que no haya errores, incluyendo el del email ya registrado
    if (Object.values(errors).some((err) => err)) {
      hayErrores = true;
    }

    if (hayErrores) {
      toast.error('Corregí los errores del formulario');
      return;
    }

    setIsLoading(true);
    const result = await registerUser(formData);
    setIsLoading(false);

    if (result.ok) {
      toast.success(result.mensaje);
      router.push('/login/login-user');
    } else {
      toast.error(result.mensaje);
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <FormBase
        title="Crear cuenta de Usuario"
        badgeText="Registro de Usuario"
        iconName="person_add"
        fields={campos}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        showPasswordToggle={true}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        footerContent={
          <div className="mt-6 text-center text-xs text-[#54433a] font-body-editorial">
            ¿Ya tenés una cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/login/login-user")}
              className="text-[#6c2f00] font-bold hover:text-[#c85a32] transition-colors ml-1 underline underline-offset-2 cursor-pointer"
            >
              Iniciá sesión acá
            </button>
          </div>
        }
      />
    </div>
  );
}
