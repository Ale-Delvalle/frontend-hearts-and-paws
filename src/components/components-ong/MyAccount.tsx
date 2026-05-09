"use client";

import { useOngAuth } from "@/context/OngAuthContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileOng from "./ProfileOng";
import AdoptionsOng from "./AdoptionsOng";
import DonationsOng from "./DonationsOng";
import CasesOng from "./CasesOng";

type ViewType = "profil" | "donations" | "adoptions" | "cases";

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
    <div className="min-h-screen bg-pink-100 dark:bg-black pt-28 pb-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-[30px] px-6">
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white dark:bg-[#c81e1e] rounded-xl shadow-sm border border-red-100 dark:border-transparent overflow-hidden sticky top-28">
            <div className="bg-[#c81e1e] dark:bg-[#a11818] px-5 py-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi cuenta
              </h2>
            </div>
            <div className="p-2 space-y-1">
              {[
                { 
                  label: "Mi Perfil", 
                  view: "profil",
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                },
                { 
                  label: "Historial de Donaciones", 
                  view: "donations",
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                },
                { 
                  label: "Solicitudes de Adopción", 
                  view: "adoptions",
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                },
                { 
                  label: "Mis Casos", 
                  view: "cases",
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                },
              ].map((item) => {
                const isActive = selectedView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => setSelectedView(item.view as ViewType)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all group ${
                      isActive
                        ? "text-[#800000] dark:text-white bg-red-50 dark:bg-[#800000]"
                        : "text-gray-700 dark:text-white bg-gray-50 dark:bg-[#a11818] hover:bg-red-50 dark:hover:bg-[#800000] hover:text-[#800000] dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`${isActive ? "text-[#800000] dark:text-white" : "text-gray-400 dark:text-white"} transition-colors`}>
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <svg className={`w-3 h-3 transition-colors transform group-hover:translate-x-1 ${isActive ? "text-[#800000] dark:text-white" : "text-gray-400 dark:text-white"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
              
              <button
                onClick={() => router.push("/chat")}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all group text-gray-700 dark:text-white bg-gray-50 dark:bg-[#a11818] hover:bg-red-50 dark:hover:bg-[#800000] hover:text-[#800000] dark:hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="text-gray-400 dark:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span>Mensajes</span>
                </div>
                <svg className="w-3 h-3 transition-colors transform group-hover:translate-x-1 text-gray-400 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
          {selectedView === "profil" && <ProfileOng />}
          {selectedView === "donations" && <DonationsOng />}
          {selectedView === "adoptions" && <AdoptionsOng />}
          {selectedView === "cases" && <CasesOng />}
        </main>
      </div>
    </div>
  );
};

export default MyAccount;
