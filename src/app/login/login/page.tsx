'use client';

import React from 'react';
import LoginSupabaseForm from "../../../components/forms/LoginSupabase";

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#fff8f5] dark:bg-[#121214] text-[#1c1c21] dark:text-[#ffede4] font-body-editorial transition-colors duration-300">
      {/* Halos decorativos de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#ffdbc9] dark:bg-[#6c2f00]/30 blur-3xl opacity-20" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#c85a32]/15 dark:bg-[#a84320]/20 blur-3xl opacity-20" />
      </div>

      <LoginSupabaseForm />
    </div>
  );
}
