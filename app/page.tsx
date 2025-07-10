import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { FeaturedAuctions } from "@/components/featured-auctions"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedAuctions />
      <CategoriesSection />
    </div>
  )
}
