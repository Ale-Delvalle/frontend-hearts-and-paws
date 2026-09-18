'use client';

import { useState, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  FaBars,
  FaTimes,
  FaExclamationTriangle,
  FaUserShield,
  FaSignOutAlt,
  FaCommentDots,
} from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface ThemeProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar = ({ theme, toggleTheme }: ThemeProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUserAndRoles = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        setRoles(['user']);
      }
    };

    getUserAndRoles();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUserAndRoles();
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  type MenuLink = {
    label: string;
    href?: string;
    icon?: JSX.Element;
    onClick?: (e?: React.MouseEvent) => void | Promise<void>;
    isButton?: boolean;
    isPrimaryBtn?: boolean;
  };

  let menuLinks: MenuLink[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Mascotas Perdidas', href: '/mascotas-perdidas' },
    { label: 'Adoptar', href: '/adoptar/adopcion' },
    { label: 'Donar', href: '/donacion' },
    { label: 'ONGs', href: '/ongs' },
    { label: 'Registro', href: '/register' },
    { label: 'Iniciar Sesión', href: '/login', isPrimaryBtn: true },
  ];

  if (user) {
    menuLinks = [
      { label: 'Historias', href: '/#historias' },
      { label: 'Publicaciones', href: '/publicaciones' },
      { label: 'Mascotas Perdidas', href: '/mascotas-perdidas' },
      { label: 'Adoptar', href: '/adoptar/adopcion' },
      { label: 'Donar', href: '/donacion' },
    ];

    if (roles.includes('ong')) {
      menuLinks.push(
        { label: 'Mi Perfil', href: '/dashboard/ong', icon: <FaUserShield /> },
        {
          label: 'Mis Casos',
          href: '/mis-casos',
          icon: <FaExclamationTriangle />,
        },
        { label: 'Mensajes', href: '/chat', icon: <FaCommentDots /> }
      );
    }

    if (roles.includes('user')) {
      menuLinks.push({ label: 'Perfil', href: '/dashboard/usuario', icon: <FaUserShield /> });
    }

    if (roles.includes('admin')) {
      menuLinks.push({
        label: 'Admin Perfil',
        href: '/dashboard/admin',
        icon: <FaUserShield />,
      });
    }

    menuLinks.push({
      label: 'Cerrar sesión',
      icon: <FaSignOutAlt />,
      isButton: true,
      isPrimaryBtn: true,
      onClick: async (e) => {
        e?.preventDefault();
        await supabase.auth.signOut();
        setUser(null);
        router.push('/sesion-cerrada');
      },
    });
  }

  const isLinkActive = (href?: string) => {
    if (!href) return false;
    if (href === '/' || href === '/#historias') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`sticky top-0 w-full z-50 transition-all ${
        scrolled
          ? 'bg-[#fff8f5]/95 dark:bg-[#121214]/95 backdrop-blur-md shadow-xs border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/15'
          : 'bg-[#fff8f5]/90 dark:bg-[#121214]/90 backdrop-blur-md border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/15'
      }`}
    >
      <div className="px-6 md:px-12 mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between h-20">
          {/* Logo Editorial */}
          <Link
            href="/"
            className="font-display-editorial text-2xl font-bold text-[#6c2f00] dark:text-[#ffdbc9] flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[#6c2f00] dark:text-[#ffdbc9] text-2xl">pets</span>
            Hearts&amp;Paws
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-7 font-body-editorial text-sm font-semibold">
              {menuLinks
                .filter((link) => !link.isPrimaryBtn)
                .map((link) => {
                  const active = isLinkActive(link.href);
                  return link.isButton ? (
                    <button
                      key={link.label}
                      onClick={link.onClick}
                      className={`transition-colors flex items-center gap-1 cursor-pointer ${
                        active
                          ? 'text-[#6c2f00] dark:text-[#ffdbc9] font-bold border-b-2 border-[#6c2f00] dark:border-[#ffdbc9] pb-0.5'
                          : 'text-[#54433a] dark:text-[#dac2b6] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9]'
                      }`}
                    >
                      {link.icon && <span className="text-base text-[#6c2f00] dark:text-[#ffdbc9]">{link.icon}</span>}
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href!}
                      className={`transition-colors flex items-center gap-1 cursor-pointer ${
                        active
                          ? 'text-[#6c2f00] dark:text-[#ffdbc9] font-bold border-b-2 border-[#6c2f00] dark:border-[#ffdbc9] pb-0.5'
                          : 'text-[#54433a] dark:text-[#dac2b6] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9]'
                      }`}
                    >
                      {link.icon && <span className="text-base text-[#6c2f00] dark:text-[#ffdbc9]">{link.icon}</span>}
                      {link.label}
                    </Link>
                  );
                })}
            </nav>

            {/* Actions (Modo claro/oscuro + Botón Destacado) */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="font-body-editorial text-xs font-semibold border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] px-4 py-2 rounded-full hover:bg-[#ffeade] dark:hover:bg-[#26262e] transition-all cursor-pointer hidden sm:flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
                <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
              </button>

              {menuLinks
                .filter((link) => link.isPrimaryBtn)
                .map((link) => (
                  <button
                    key={link.label}
                    onClick={(e) => {
                      if (link.onClick) {
                        link.onClick(e);
                      } else if (link.href) {
                        router.push(link.href);
                      }
                    }}
                    className="bg-[#c85a32] hover:bg-[#a84320] text-white font-body-editorial text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">login</span>
                    {link.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Toggle Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#6c2f00] dark:text-[#ffdbc9] focus:outline-none p-2"
              aria-label="Abrir menú"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="px-6 py-6 space-y-4 bg-[#fff8f5] dark:bg-[#121214] border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 shadow-md md:hidden font-body-editorial"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuLinks.map((link) =>
              link.isButton ? (
                <button
                  key={link.label}
                  onClick={(e) => {
                    setIsOpen(false);
                    link.onClick?.(e);
                  }}
                  className="w-full text-left font-semibold text-base text-[#6c2f00] dark:text-[#ffdbc9] py-1 flex items-center gap-2"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href!}
                  onClick={() => setIsOpen(false)}
                  className="block font-semibold text-base text-[#54433a] dark:text-[#dac2b6] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9] py-1"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-2 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/15 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="w-full font-body-editorial text-xs font-semibold border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 text-[#6c2f00] dark:text-[#ffdbc9] py-2.5 rounded-full hover:bg-[#ffeade] dark:hover:bg-[#26262e] transition-all text-center flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
                <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;

