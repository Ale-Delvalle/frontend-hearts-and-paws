// components/Footer.tsx
import { FaPaw, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

 export const Footer = () => {
  return (
    <footer className="py-8 mt-12 text-gray-800 dark:text-gray-200 bg-[#ffece8] dark:bg-black">
      <div className="grid grid-cols-1 gap-8 px-4 mx-auto max-w-7xl md:grid-cols-3">
        {/* Logo + Descripción */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-2xl font-bold text-[#FA8072]">
            <FaPaw />
            <span>Hearts&Paws</span>
          </div>
          <p className="text-sm">
            Rescatamos, cuidamos y conectamos animales con hogares llenos de amor. ¡Gracias por apoyar nuestra misión! 💕
          </p>
        </div>

       {/* Enlaces rápidos */}
<div>
  <h4 className="mb-2 font-semibold">Enlaces</h4>
  <ul className="space-y-1 text-sm">
    <li>
      <a href="/adoptar/adopcion" className="hover:text-[#FA8072]">
        Adopciones
      </a>
    </li>
    <li>
      <a href="/donacion" className="hover:text-[#FA8072]">
        Donaciones
      </a>
    </li>
    <li>
      <Link href="/register" className="hover:text-[#FA8072]">
        Registro
      </Link>
    </li>
    <li>
      <a href="/login" className="hover:text-[#FA8072]">Iniciar sesión</a>
    </li>
  </ul>
</div>


        {/* Redes sociales */}
        <div>
          <h4 className="mb-2 font-semibold">Seguinos</h4>
          <div className="flex gap-4 text-xl text-[#FA8072]">
            <a href="#" aria-label="Facebook" className="hover:text-[#FA8072]"><FaFacebook /></a>
            <a href="#" aria-label="Instagram" className="hover:text-[#FA8072]"><FaInstagram /></a>
            <a href="#" aria-label="Twitter" className="hover:text-[#FA8072]"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-8 text-sm text-center text-gray-500 dark:text-gray-400 border-t border-[#ffbba5] dark:border-zinc-800">
        © {new Date().getFullYear()} Hearts&Paws. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
