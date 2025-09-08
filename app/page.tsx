import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { FeaturedAuctions } from "@/components/featured-auctions"
import { EndingSoonAuctions } from "@/components/ending-soon"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <FeaturedAuctions />
      <EndingSoonAuctions />
      <CategoriesSection />
    </div>
  )
}
