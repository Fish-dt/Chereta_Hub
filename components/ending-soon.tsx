"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AuctionCard } from "@/components/auction-card"
import { AuctionCardSkeleton } from "@/components/skeletons/auction-card-skeleton"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = new Date(endTime).getTime() - now

      if (distance <= 0) {
        setTimeLeft("Ended")
        clearInterval(interval)
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  return (
    <div className="flex items-center justify-center mt-2 text-red-500 font-semibold animate-pulse text-sm">
      <Clock className="w-4 h-4 mr-1" />
      <span>{timeLeft !== "Ended" ? `Ends in ${timeLeft}` : "Auction Ended"}</span>
    </div>
  )
}

export function EndingSoonAuctions() {
  const [auctions, setAuctions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Placeholder data
    const mockAuctions = [
      {
        _id: "1",
        title: "Fikir Eskemekabir",
        category: "Book",
        startingBid: 50,
        currentBid: Math.floor(Math.random() * 1000) + 50,
        endTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(), // 2h
        images: ["/auctions/53713557.jpg"],
        bidCount: Math.floor(Math.random() * 20),
        status: "active",
      },
      {
        _id: "2",
        title: "iPhone 16 Pro",
        category: "Electronics",
        startingBid: 500,
        currentBid: Math.floor(Math.random() * 1000) + 500,
        endTime: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45m
        images: ["/auctions/auction_1751923716664_0.jpeg"],
        bidCount: Math.floor(Math.random() * 20),
        status: "active",
      },
    ]
    setAuctions(mockAuctions)
    setIsLoading(false)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 260 + 24 // card width + gap
      const amount = direction === "left" ? -cardWidth : cardWidth
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  return (
    <section className="pt-4 pb-16 px-4 bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-600">
            Ending Soon
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hurry up! These deals are about to slip away.
          </p>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden pl-2 pr-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-w-[260px] max-w-[260px]">
                <AuctionCardSkeleton />
              </div>
            ))}
          </div>
        ) : auctions.length > 0 ? (
          <div className="relative">
            {/* Left Arrow */}
            

            {/* Scrollable Row */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-scroll scroll-smooth pl-2 pr-2
                         [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {auctions.map((auction) => (
                <div
                  key={auction._id}
                  className="min-w-[260px] max-w-[260px] snap-start relative"
                >
                  <AuctionCard auction={auction} />
                </div>
              ))}
            </div>

            
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No auctions are ending soon right now.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
