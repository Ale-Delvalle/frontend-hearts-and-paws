"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding, FaChartPie, FaChevronDown, FaInbox } from "react-icons/fa";
import Link from "next/link";
import {
  FaPaw,
  FaBars,
  FaTimes,
  FaExclamationTriangle,
  FaRegClipboard,
  FaSignInAlt,
  FaUserShield,
  FaSignOutAlt,
  FaHome,
  FaHandsHelping,
  FaUser,
  FaCat,
} from "react-icons/fa";

import { useOngAuth } from "@/context/OngAuthContext";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";

interface ThemeProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar = ({ theme, toggleTheme }: ThemeProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showHistorialDropdown, setShowHistorialDropdown] = useState(false);
  const [showPublicarDropdown, setShowPublicarDropdown] = useState(false);

  const { ong, logout: logoutOng } = useOngAuth();
  const { usuario, logout: logoutUsuario } = useUsuarioAuth();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hasMounted) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogoutOng = () => {
    logoutOng();
    router.refresh();
    router.push("/");
  };

  const handleLogoutUsuario = () => {
    logoutUsuario();
    router.refresh();
    router.push("/");
  };

  type MenuLink = {
    label: string;
    href: string;
    icon?: JSX.Element;
    onClick?: () => void;
    subItems?: { label: string; href: string }[];
    isPrimaryBtn?: boolean;
  };

  let menuLinks: MenuLink[] = [];

  if (ong) {
    menuLinks = [
      { label: "Inicio", href: "/", icon: <FaHome /> },
      { label: "Mi Perfil", href: "/dashboard/ong", icon: <FaUserShield /> },
      {
        label: "Publicar",
        href: "#",
        icon: <FaExclamationTriangle />,
        onClick: () => setShowPublicarDropdown((prev) => !prev),
        subItems: [
          { label: "Registrar nueva mascota", href: "/dashboard/ong/nueva-mascota" },
          { label: "Crear caso", href: "/dashboard/ong/crear-caso" },
        ],
      },
      {
        label: "Cerrar sesión",
        href: "#",
        icon: <FaSignOutAlt />,
        onClick: handleLogoutOng,
        isPrimaryBtn: true,
      },
    ];
  } else if (usuario) {
    if (usuario.rol === "ADMIN") {
      menuLinks = [
        {
          label: "Resumen",
          href: "/dashboard/admin/resumen",
          icon: <FaChartPie />,
        },
        {
          label: "Solicitudes",
          href: "/dashboard/admin",
          icon: <FaInbox />,
        },
        {
          label: "Usuarios",
          href: "/dashboard/admin/vista-user",
          icon: <FaUser />,
        },
        {
          label: "Organizaciones",
          href: "/dashboard/admin/organizaciones",
          icon: <FaBuilding />,
        },
        {
          label: "Mascotas",
          href: "#",
          icon: <FaCat />,
          onClick: () => setShowHistorialDropdown((prev) => !prev),
          subItems: [
            { label: "Mascotas", href: "/dashboard/admin/mascotas-registradas" },
            { label: "Adopciones", href: "/dashboard/admin/adopciones-registradas" },
            { label: "Donaciones", href: "/dashboard/admin/donaciones-recibidas" },
          ],
        },
        {
          label: "Cerrar sesión",
          href: "#",
          icon: <FaSignOutAlt />,
          onClick: handleLogoutUsuario,
          isPrimaryBtn: true,
        },
      ];
    } else {
      menuLinks = [
        { label: "Historias", href: "/#historias" },
        { label: "Adoptar", href: "/adoptar/adopcion" },
        { label: "Donar", href: "/donacion" },
        { label: "Perfil", href: "/dashboard/usuario" },
        {
          label: "Cerrar sesión",
          href: "#",
          icon: <FaSignOutAlt />,
          onClick: handleLogoutUsuario,
          isPrimaryBtn: true,
        },
      ];
    }
  } else {
    menuLinks = [
      { label: "Historias", href: "/#historias" },
      { label: "Adoptar", href: "/adoptar/adopcion" },
      { label: "Donar", href: "/donacion" },
      { label: "ONGs", href: "/ongs" },
      { label: "Iniciar Sesión", href: "/login", isPrimaryBtn: true },
    ];
  }

  const isLinkActive = (href: string) => {
    if (href === '/' || href === '/#historias') return pathname === '/';
    if (href === '#') return false;
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 w-full z-50 transition-all ${
        scrolled
          ? "bg-[#fff8f5]/95 backdrop-blur-md shadow-xs border-b border-[#6c2f00]/10"
          : "bg-[#fff8f5]/90 backdrop-blur-md border-b border-[#6c2f00]/10"
      }`}
    >
      <div className="px-6 md:px-12 mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between h-20">
          {/* Logo Editorial */}
          <Link
            href="/"
            className="font-display-editorial text-2xl font-bold text-[#6c2f00] flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[#6c2f00] text-2xl">pets</span>
            Hearts&amp;Paws
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-7">
              {menuLinks
                .filter((link) => !link.isPrimaryBtn)
                .map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <div key={link.label} className="relative group">
                      {link.onClick ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            link.onClick?.();
                          }}
                          className={`font-body-editorial text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                            active
                              ? "text-[#6c2f00] font-bold border-b-2 border-[#6c2f00] pb-0.5"
                              : "text-[#54433a] hover:text-[#6c2f00]"
                          }`}
                        >
                          {link.icon && <span className="text-base text-[#6c2f00]">{link.icon}</span>}
                          {link.label}
                          {link.subItems && <FaChevronDown className="ml-1 text-xs text-[#6c2f00]" />}
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          className={`font-body-editorial text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                            active
                              ? "text-[#6c2f00] font-bold border-b-2 border-[#6c2f00] pb-0.5"
                              : "text-[#54433a] hover:text-[#6c2f00]"
                          }`}
                        >
                          {link.icon && <span className="text-base text-[#6c2f00]">{link.icon}</span>}
                          {link.label}
                        </Link>
                      )}

                      {/* Dropdown de SubItems */}
                      {link.subItems &&
                        ((link.label === "Mascotas" && showHistorialDropdown) ||
                          (link.label === "Publicar" && showPublicarDropdown)) && (
                          <div className="absolute left-0 z-20 mt-2 w-52 bg-white border border-[#6c2f00]/15 rounded-xl shadow-md p-1">
                            {link.subItems.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="block px-4 py-2 text-xs font-semibold text-[#54433a] hover:text-[#6c2f00] hover:bg-[#ffeade] rounded-lg transition-all"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  );
                })}
            </nav>

            {/* Acciones Derecha (Modo claro/oscuro + Botón Destacado) */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="font-body-editorial text-xs font-semibold border border-[#6c2f00]/20 text-[#6c2f00] px-4 py-2 rounded-full hover:bg-[#ffeade] transition-all cursor-pointer hidden sm:block"
              >
                {theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}
              </button>

              {menuLinks
                .filter((link) => link.isPrimaryBtn)
                .map((link) => (
                  <button
                    key={link.label}
                    onClick={(e) => {
                      if (link.onClick) {
                        e.preventDefault();
                        link.onClick();
                      } else {
                        router.push(link.href);
                      }
                    }}
                    className="bg-[#ff6b6b] hover:bg-[#ae2f34] text-white font-body-editorial text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">login</span>
                    {link.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Toggle Menú Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#6c2f00] focus:outline-none p-2"
              aria-label="Abrir menú"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="px-6 py-6 space-y-4 bg-[#fff8f5] border-b border-[#6c2f00]/10 shadow-md md:hidden font-body-editorial"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuLinks.map((link) => (
              <div key={link.label}>
                {link.onClick ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      link.onClick?.();
                      setIsOpen(false);
                    }}
                    className="w-full text-left font-semibold text-base text-[#6c2f00] py-1 flex items-center gap-2"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block font-semibold text-base text-[#54433a] hover:text-[#6c2f00] py-1"
                  >
                    {link.label}
                  </Link>
                )}

                {link.subItems && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-[#6c2f00]/20 pl-3">
                    {link.subItems.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm text-[#54433a] hover:text-[#6c2f00]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2 border-t border-[#6c2f00]/10 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="w-full font-body-editorial text-xs font-semibold border border-[#6c2f00]/20 text-[#6c2f00] py-2.5 rounded-full hover:bg-[#ffeade] transition-all text-center"
              >
                {theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
