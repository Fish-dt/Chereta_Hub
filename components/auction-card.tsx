"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Users } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface AuctionCardProps {
  auction: {
    _id: string
    title: string
    description: string
    startingBid: number
    currentBid: number
    endTime: string
    images?: string[]
    category: string
    seller?: {
      firstName: string
      lastName: string
    }
    bidCount: number
    status: string
  }
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState("")
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const { t, language } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const endTime = new Date(auction.endTime).getTime()
      const difference = endTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`)
        } else {
          setTimeLeft(`${minutes}m`)
        }
      } else {
        setTimeLeft("Ended")
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [auction.endTime])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement watchlist functionality
    setIsWatchlisted(!isWatchlisted)
  }

  // Safe image access with fallback
  const imageUrl =
    auction.images && auction.images.length > 0 ? auction.images[0] : "/placeholder.jpg"

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/auction/${auction._id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={auction.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {auction.category}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Button
              size="icon"
              variant="ghost"
              className="bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={toggleWatchlist}
            >
              <Heart className={`h-4 w-4 ${isWatchlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
          {auction.status === "ended" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Ended
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className={`font-semibold text-lg mb-2 line-clamp-2 ${language === "am" ? "font-amharic" : ""}`}>
            {auction.title}
          </h3>
          {/* Hide description on list cards; show only on detail page */}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm text-muted-foreground ${language === "am" ? "font-amharic" : ""}`}>
                {t("auction.currentBid")}
              </span>
              <span className="font-bold text-lg text-primary">{formatCurrency(auction.currentBid)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {auction.bidCount} {t("auction.bids")}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{timeLeft}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className={`w-full ${language === "am" ? "font-amharic" : ""}`} disabled={auction.status === "ended"}>
            {auction.status === "ended" ? t("auction.ended") : t("auction.placeBid")}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
