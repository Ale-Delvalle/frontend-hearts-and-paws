import Link from 'next/link';
import { GeneroUsuario, Insignia } from '@/types/insignia';
import { textoInsignia } from '@/utils/insignias';

interface InsigniaBadgeProps {
  insignia: Insignia;
  genero?: GeneroUsuario | null;
}

const ICONO: Record<Insignia['tipo'], string> = {
  TRANSITO: 'home',
  PADRINO: 'favorite',
};

export default function InsigniaBadge({ insignia, genero }: InsigniaBadgeProps) {
  const texto = textoInsignia(insignia.tipo, insignia.organizacion.nombre, genero);
  const claseColor =
    insignia.tipo === 'TRANSITO' ? 'insignia-badge--transito' : 'insignia-badge--padrino';

  return (
    <Link
      href={`/ong/${insignia.organizacion.id}`}
      className={`insignia-badge ${claseColor} inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-sm bg-clip-padding hover:opacity-90 transition-opacity`}
      title={`Reconocimiento otorgado por ${insignia.organizacion.nombre}`}
    >
      <span className="material-symbols-outlined text-sm">{ICONO[insignia.tipo]}</span>
      {texto}
    </Link>
  );
}
