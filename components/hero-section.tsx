"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Gavel, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useSession } from "next-auth/react"

export function HeroSection() {
  const { t, language } = useLanguage()
  const { data: session } = useSession()

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-5 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${language === "am" ? "font-amharic" : ""}`}
          >
            {t("hero.title")}
          </h1>
          <p
            className={`text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto ${language === "am" ? "font-amharic" : ""}`}
          >
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input placeholder={t("hero.search.placeholder")} className="pl-10 h-12 text-lg" />
            </div>
            <Button size="lg" className={`h-12 px-8 ${language === "am" ? "font-amharic" : ""}`}>
              {t("hero.search.button")}
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
