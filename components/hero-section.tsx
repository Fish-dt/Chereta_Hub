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
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {session ? (
              <Button asChild size="lg" className={`h-12 px-8 ${language === "am" ? "font-amharic" : ""}`}>
                <Link href="/sell">
                  <Gavel className="mr-2 h-5 w-5" />
                  {t("hero.start.selling")}
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className={`h-12 px-8 ${language === "am" ? "font-amharic" : ""}`}>
                  <Link href="/auth/register">{t("hero.get.started")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={`h-12 px-8 ${language === "am" ? "font-amharic" : ""}`}
                >
                  <Link href="/auctions">{t("hero.browse.auctions")}</Link>
                </Button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${language === "am" ? "font-amharic" : ""}`}>
                {t("hero.feature.competitive")}
              </h3>
              <p className={`text-muted-foreground ${language === "am" ? "font-amharic" : ""}`}>
                {t("hero.feature.competitive.desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${language === "am" ? "font-amharic" : ""}`}>
                {t("hero.feature.secure")}
              </h3>
              <p className={`text-muted-foreground ${language === "am" ? "font-amharic" : ""}`}>
                {t("hero.feature.secure.desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${language === "am" ? "font-amharic" : ""}`}>
                {t("hero.feature.easy")}
              </h3>
              <p className={`text-muted-foreground ${language === "am" ? "font-amharic" : ""}`}>
                {t("hero.feature.easy.desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
