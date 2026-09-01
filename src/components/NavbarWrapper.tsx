"use client";

import { useEffect, useState } from "react";
import { useOngAuth } from "@/context/OngAuthContext";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { User } from "@supabase/supabase-js";
import { createClient } from '@supabase/supabase-js';

const NavbarSupabase = dynamic(() => import("./navbars/NavbarSupabase"), { ssr: false });
const NavbarLocal = dynamic(() => import("./navbars/NavbarLocal"), { ssr: false });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ThemeMode = "light" | "dark";

const NavbarWrapper = () => {
  const pathname = usePathname();
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { ong } = useOngAuth();
  const { usuario } = useUsuarioAuth();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as ThemeMode | null;
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(storedTheme ?? preferredTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setUser(null);
      } else {
        setUser(user);
      }

      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  if (loading) return null;

  if (user) return <NavbarSupabase theme={theme} toggleTheme={toggleTheme} />;
  if (ong || usuario) return <NavbarLocal theme={theme} toggleTheme={toggleTheme} />;

  return <NavbarLocal theme={theme} toggleTheme={toggleTheme} />;
};

export default NavbarWrapper;
