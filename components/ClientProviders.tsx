
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ChatBot } from "@/components/ChatBot";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
          <ChatBot />
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
