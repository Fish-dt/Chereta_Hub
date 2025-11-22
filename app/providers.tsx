"use client";
import { SessionProvider } from "next-auth/react";
import ReduxProvider from "@/store/Provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ChatBot } from "@/components/ChatBot";

export function Providers({ children }: { children: React.ReactNode }) {
  console.log("Providers mounted");
  return (
    <SessionProvider>
      <ReduxProvider>
        <Navbar />
        {children}
        <Footer />
        <Toaster />
        <ChatBot />
      </ReduxProvider>
    </SessionProvider>
  );
} 