"use client";

import { useOngAuth } from "@/context/OngAuthContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileOng from "./ProfileOng";
import AdoptionsOng from "./AdoptionsOng";
import DonationsOng from "./DonationsOng";
import CasesOng from "./CasesOng";
import InsigniasOng from "./InsigniasOng";
import ReconocimientosOng from "./ReconocimientosOng";

type ViewType = "profil" | "donations" | "adoptions" | "cases" | "insignias" | "reconocimientos";

const MyAccount = () => {
  const { ong, loading } = useOngAuth();
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<ViewType>("profil");

  // Redirige si no hay sesión
  useEffect(() => {
    if (!loading && !ong) {
      router.push("/login");
    }
  }, [loading, ong, router]);

  if (loading || !ong) return null;

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial pt-28 pb-12 selection:bg-[#c85a32] selection:text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-[#1c1c21] rounded-2xl shadow-xs border border-[#6c2f00]/15 dark:border-[#ffdbc9]/15 overflow-hidden sticky top-28">
            <div className="bg-[#fff1ea] dark:bg-[#26262e] px-5 py-4 border-b border-[#6c2f00]/10 dark:border-[#ffdbc9]/10">
              <h2 className="font-display-editorial text-lg font-bold text-[#6c2f00] dark:text-[#ffdbc9] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c85a32]">corporate_fare</span>
                Panel de ONG
              </h2>
            </div>
            <div className="p-3 space-y-1.5">
              {[
                { 
                  label: "Mi Perfil", 
                  view: "profil",
                  icon: <span className="material-symbols-outlined text-lg">domain</span>
                },
                { 
                  label: "Historial de Donaciones", 
                  view: "donations",
                  icon: <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                },
                { 
                  label: "Solicitudes de Adopción", 
                  view: "adoptions",
                  icon: <span className="material-symbols-outlined text-lg">assignment</span>
                },
                {
                  label: "Mis Casos",
                  view: "cases",
                  icon: <span className="material-symbols-outlined text-lg">folder_open</span>
                },
                {
                  label: "Insignias",
                  view: "insignias",
                  icon: <span className="material-symbols-outlined text-lg">workspace_premium</span>
                },
                {
                  label: "Reconocimientos",
                  view: "reconocimientos",
                  icon: <span className="material-symbols-outlined text-lg">verified</span>
                },
              ].map((item) => {
                const isActive = selectedView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => setSelectedView(item.view as ViewType)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer group ${
                      isActive
                        ? "text-[#6c2f00] dark:text-[#ffdbc9] bg-[#fff1ea] dark:bg-[#26262e] border border-[#6c2f00]/20 dark:border-[#ffdbc9]/20 shadow-xs"
                        : "text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`${isActive ? "text-[#c85a32] dark:text-[#ffdbc9]" : "text-[#54433a] dark:text-[#dac2b6] group-hover:text-[#6c2f00] dark:group-hover:text-[#ffdbc9]"} transition-colors flex items-center`}>
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <span className={`material-symbols-outlined text-base transition-transform group-hover:translate-x-1 ${isActive ? "text-[#6c2f00] dark:text-[#ffdbc9]" : "text-[#54433a] dark:text-[#dac2b6]"}`}>
                      chevron_right
                    </span>
                  </button>
                );
              })}
              
              <button
                onClick={() => router.push("/chat")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer group text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="text-[#54433a] dark:text-[#dac2b6] group-hover:text-[#6c2f00] dark:group-hover:text-[#ffdbc9] transition-colors flex items-center">
                    <span className="material-symbols-outlined text-lg">chat</span>
                  </div>
                  <span>Mensajes</span>
                </div>
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1 text-[#54433a] dark:text-[#dac2b6]">
                  chevron_right
                </span>
              </button>

              <div className="pt-2 border-t border-[#6c2f00]/10 dark:border-[#ffdbc9]/10 space-y-1.5">
                <button
                  onClick={() => router.push("/dashboard/ong/nueva-mascota")}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer group text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg text-[#c85a32]">pets</span>
                    <span>Nueva Mascota</span>
                  </div>
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1 text-[#54433a] dark:text-[#dac2b6]">
                    add
                  </span>
                </button>

                <button
                  onClick={() => router.push("/dashboard/ong/crear-caso")}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer group text-[#54433a] dark:text-[#dac2b6] hover:bg-[#ffeade] dark:hover:bg-[#26262e] hover:text-[#6c2f00] dark:hover:text-[#ffdbc9]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg text-[#c85a32]">post_add</span>
                    <span>Crear Caso</span>
                  </div>
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1 text-[#54433a] dark:text-[#dac2b6]">
                    add
                  </span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
          {selectedView === "profil" && <ProfileOng />}
          {selectedView === "donations" && <DonationsOng />}
          {selectedView === "adoptions" && <AdoptionsOng />}
          {selectedView === "cases" && <CasesOng />}
          {selectedView === "insignias" && <InsigniasOng />}
          {selectedView === "reconocimientos" && <ReconocimientosOng />}
        </main>
      </div>
    </div>
  );
};

export default MyAccount;
