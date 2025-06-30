"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Gavel } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function HeroSection() {
  const { t, language } = useLanguage()

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Gavel className="h-16 w-16 text-yellow-400" />
          </div>
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent ${language === "am" ? "font-amharic" : ""}`}
          >
            {t("hero.title")}
          </h1>
          <p className={`text-xl md:text-2xl mb-8 text-blue-100 ${language === "am" ? "font-amharic" : ""}`}>
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("hero.search.placeholder")}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
            <Button
              size="lg"
              className={`bg-yellow-500 hover:bg-yellow-600 text-black font-semibold ${language === "am" ? "font-amharic" : ""}`}
            >
              {t("hero.search.button")}
            </Button>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${language === "am" ? "font-amharic" : ""}`}>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/auctions">{t("hero.browse")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/auth/register">{t("hero.start.selling")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
