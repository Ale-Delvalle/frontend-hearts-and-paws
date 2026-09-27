export interface OngFormDataType {
  nombre: string;
  email: string;
  contrasena: string;
  descripcion: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
 // creado_en:number;
}

// OngAuthContext.tsx
export type OngUser = {
  id: string;
  nombre: string;
  descripcion: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  plan: string;
  imagenPerfil: string;
  creado_en:number;
  email:string;
};


export type ContextType = {
  ong: OngUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  logged: boolean;
};

// GET /organizaciones/:id/perfil
export type OngPerfilPublico = {
  id: string;
  nombre: string;
  descripcion: string | null;
  ciudad: string | null;
  pais: string | null;
  imagenPerfil: string | null;
  creado_en: string;
  mascotasActivas: number;
  casosPublicados: number;
  totalReconocimientos: number;
};

// GET /organizaciones/:id/reconocimientos/mi-estado
export type ReconocimientoEstado = {
  yaReconocida: boolean;
};

// GET /organizaciones/mis-reconocimientos
export type ReconocimientoRecibido = {
  id: string;
  mensaje: string | null;
  creado_en: string;
  revocado_en: string | null;
  motivoRevocacion: string | null;
  otorgadoPor: {
    tipo: 'USUARIO' | 'ONG';
    id: string;
    nombre: string;
  };
};