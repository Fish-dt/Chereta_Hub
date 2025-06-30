"use client"

import { Suspense } from "react"
import { FeaturedAuctions } from "@/components/featured-auctions"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { StatsSection } from "@/components/stats-section"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <Suspense fallback={<div className="text-center py-8">{t("common.loading")}</div>}>
        <FeaturedAuctions />
      </Suspense>
    </div>
  )
}
