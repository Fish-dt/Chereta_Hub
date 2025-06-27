import { Suspense } from "react"
import { FeaturedAuctions } from "@/components/featured-auctions"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { StatsSection } from "@/components/stats-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <Suspense fallback={<div className="text-center py-8">Loading auctions...</div>}>
        <FeaturedAuctions />
      </Suspense>
    </div>
  )
}
