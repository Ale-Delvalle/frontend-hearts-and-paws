import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Work_Sans } from "next/font/google";
import "./globals.css";

import NavbarWrapper from "@/components/NavbarWrapper";
import { UsuarioAuthProvider } from "@/context/UsuarioAuthContext";
import { OngAuthProvider } from "@/context/OngAuthContext";
import { AuthProvider } from "@/components/SupabaseProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Hearts and Paws",
  description: "Conectando personas y ONGs para ayudar a animales necesitados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${workSans.variable} antialiased`}
      >
        <AuthProvider>
          <UsuarioAuthProvider>
            <OngAuthProvider>
              <NavbarWrapper />
              <main className="bg-[color:var(--background)] min-h-screen">{children}</main>
              <Toaster />
            </OngAuthProvider>
          </UsuarioAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
