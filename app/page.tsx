import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { FeaturedAuctions } from "@/components/featured-auctions"
import { StatsSection } from "@/components/stats-section"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <CategoriesSection />
      <FeaturedAuctions />
      <StatsSection />
    </div>
  )
}
