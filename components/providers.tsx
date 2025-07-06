"use client"

import type React from "react"

import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { SessionProvider } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
