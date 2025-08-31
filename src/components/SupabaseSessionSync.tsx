"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

export default function SupabaseSessionSync() {

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      console.log("🔁 Evento auth:", event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
