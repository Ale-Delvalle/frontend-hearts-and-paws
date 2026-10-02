import { GeneroUsuario, Insignia } from './insignia';

// Datos del formulario de registro (también sirve para enviar al backend)
export interface RegisterData {
  nombre: string;
  email: string;
  contrasena: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  genero: string;
}

// Usuario que devuelve el backend
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  imagenPerfil: string | null;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  genero?: GeneroUsuario | null;
  insignias?: Insignia[];
}

// GET /usuarios/:id/perfil — perfil público, sin datos de contacto
export interface UsuarioPerfilPublico {
  id: string;
  nombre: string;
  imagenPerfil: string | null;
  ciudad: string | null;
  pais: string | null;
  genero?: GeneroUsuario | null;
  creado_en: string;
  insignias: Insignia[];
}

export interface FormDataType {
    nombre: string,
    email: string,
    contrasena: string,
    telefono: string,
    direccion: string,
    ciudad: string,
    pais: string,
}


// Tipo del contexto de autenticación
export interface AuthContextType {
  usuario: Usuario | null;
  registerUser: (data: RegisterData) => Promise<{ ok: boolean; mensaje: string }>;
  loginUsuario: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
   logged: boolean;
   loading:boolean;
}
