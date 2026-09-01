import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-[#fbddca] w-full py-12 px-6 md:px-12 border-t border-[#dac2b6]/40 font-body-editorial text-[#28180d]">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto gap-8">
        <div className="font-display-editorial text-2xl font-bold text-[#6c2f00] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6c2f00]">pets</span>
          Hearts&amp;Paws
        </div>
        <nav className="flex flex-wrap justify-center gap-6 font-body-editorial text-sm font-semibold text-[#54433a]">
          <a href="/adoptar/adopcion" className="hover:text-[#6c2f00] transition-colors">Adopciones</a>
          <a href="/donacion" className="hover:text-[#6c2f00] transition-colors">Donaciones</a>
          <Link href="/register" className="hover:text-[#6c2f00] transition-colors">Registro</Link>
          <a href="/login" className="hover:text-[#6c2f00] transition-colors">Iniciar sesión</a>
        </nav>
        <div className="font-body-editorial text-sm text-[#6c2f00] text-center md:text-right font-medium">
          © {new Date().getFullYear()} Hearts&amp;Paws. Cada huella cuenta una historia.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
