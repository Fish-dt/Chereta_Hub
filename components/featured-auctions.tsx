"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AuctionCard } from "@/components/auction-card"
import { AuctionCardSkeleton } from "@/components/skeletons/auction-card-skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function FeaturedAuctions() {
  const [auctions, setAuctions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t, language } = useLanguage()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchFeaturedAuctions()
  }, [])

  const fetchFeaturedAuctions = async () => {
    try {
      const response = await fetch("/api/auctions?limit=5&status=active")
      if (response.ok) {
        const data = await response.json()
        setAuctions(data.auctions.slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching featured auctions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 260 + 24 // card width + gap
      const amount = direction === "left" ? -cardWidth : cardWidth
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  return (
    <section className="pt-4 pb-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              language === "am" ? "font-amharic" : ""
            }`}
          >
            {t("featured.title")}
          </h2>
          <p
            className={`text-xl text-muted-foreground max-w-2xl mx-auto ${
              language === "am" ? "font-amharic" : ""
            }`}
          >
            {t("featured.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden pl-2 pr-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="min-w-[260px] max-w-[260px]">
                <AuctionCardSkeleton />
              </div>
            ))}
          </div>
        ) : auctions.length > 0 ? (
          <>
            {/* 🔹 Carousel wrapper */}
            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={() => scroll("left")}
                className="absolute -left-6 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-background transition z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Scrollable Row (no scrollbar visible) */}
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-scroll scroll-smooth pl-2 pr-2
                           [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {auctions.map((auction) => (
                  <div
                    key={auction._id}
                    className="min-w-[260px] max-w-[260px] snap-start"
                  >
                    <AuctionCard auction={auction} />
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scroll("right")}
                className="absolute -right-6 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-background transition z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center mt-8">
              <Button
                asChild
                size="lg"
                className={language === "am" ? "font-amharic" : ""}
              >
                <Link href="/auctions">{t("featured.view.all")}</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p
              className={`text-muted-foreground ${
                language === "am" ? "font-amharic" : ""
              }`}
            >
              {t("featured.no.auctions")}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
