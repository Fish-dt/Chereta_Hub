"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AuctionCard } from "@/components/auction-card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function FeaturedAuctions() {
  const [auctions, setAuctions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchFeaturedAuctions()
  }, [])

  const fetchFeaturedAuctions = async () => {
    try {
      const response = await fetch("/api/auctions?limit=8&status=active")
      if (response.ok) {
        const data = await response.json()
        setAuctions(data.auctions)
      }
    } catch (error) {
      console.error("Error fetching featured auctions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${language === "am" ? "font-amharic" : ""}`}>
            {t("featured.title")}
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${language === "am" ? "font-amharic" : ""}`}>
            {t("featured.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : auctions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {auctions.map((auction: any) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className={language === "am" ? "font-amharic" : ""}>
                <Link href="/auctions">{t("featured.view.all")}</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className={`text-muted-foreground ${language === "am" ? "font-amharic" : ""}`}>
              {t("featured.no.auctions")}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
