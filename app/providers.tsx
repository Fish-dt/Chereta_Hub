"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 