export type TipoInsignia = 'TRANSITO' | 'PADRINO';

export type GeneroUsuario = 'MASCULINO' | 'FEMENINO';

export interface OrganizacionResumen {
  id: string;
  nombre: string;
}

// Insignia tal como la ve el propio usuario en su perfil (GET /usuarios/me)
export interface Insignia {
  id: string;
  tipo: TipoInsignia;
  otorgada_en: string;
  organizacion: OrganizacionResumen;
}

// Usuario tal como lo ve la ONG al buscarlo (GET /insignias/usuarios)
export interface UsuarioBuscado {
  id: string;
  nombre: string;
  email: string;
  imagenPerfil: string | null;
  ciudad: string | null;
}

// Insignia tal como la ve la ONG que la otorgó (GET /insignias)
export interface InsigniaOtorgada {
  id: string;
  tipo: TipoInsignia;
  otorgada_en: string;
  usuario: UsuarioBuscado;
}
