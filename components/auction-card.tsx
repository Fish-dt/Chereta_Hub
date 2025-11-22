"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Bookmark } from "lucide-react"

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
    city?: string
  }
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const calculateTimeLeft = () => {
    const now = new Date().getTime()
    const endTime = new Date(auction.endTime).getTime()
    const difference = endTime - now

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        return `${days}d ${hours}h`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else {
        return `${minutes}m`
      }
    } else {
      return "Ended"
    }
  }

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft())
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
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

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  const imageUrl = auction.images && auction.images.length > 0 ? auction.images[0] : "/placeholder.jpg"

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-white dark:bg-slate-950 border-0">
      <Link href={`/auction/${auction._id}`} className="flex flex-col flex-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={auction.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Timer overlay - top left */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-white shadow-md">
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-semibold text-xs whitespace-nowrap">{timeLeft}</span>
          </div>

          {/* Category badge - top right */}
          <div className="absolute top-3 right-3 z-10">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-md text-foreground font-semibold text-xs shadow-md"
            >
              {auction.category}
            </Badge>
          </div>

          {auction.status === "ended" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <Badge variant="destructive" className="text-sm px-3 py-1">
                Ended
              </Badge>
            </div>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent backdrop-blur-sm"></div>

        <CardContent className="p-3 space-y-2 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {auction.title}
          </h3>

          {/* City and seller info - left and right aligned */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {auction.city && (
                <>
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="font-medium">{auction.city}</span>
                </>
              )}
            </div>
            {auction.seller && (
              <Badge variant="outline" className="text-xs font-medium px-2 py-0.5 bg-slate-50 dark:bg-slate-900">
                {auction.seller.firstName} {auction.seller.lastName}
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Bid</span>
            <span className="font-bold text-lg text-primary">{formatCurrency(auction.currentBid)}</span>
          </div>
          {auction.bidCount > 0 && (
            <div className="text-xs text-muted-foreground">
              {auction.bidCount} {auction.bidCount === 1 ? 'bid' : 'bids'}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-3 pt-0 flex items-center justify-between gap-2">
          <Button
            className="flex-1 font-semibold text-sm py-2 h-auto shadow-md hover:shadow-lg transition-all hover:bg-primary/90 hover:backdrop-blur-md"
            disabled={auction.status === "ended"}
            variant={auction.status === "ended" ? "outline" : "default"}
          >
            {auction.status === "ended" ? "Ended" : "Place Bid"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-10 w-10 p-0 rounded-full hover:bg-white/30 hover:backdrop-blur-md dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-md flex-shrink-0"
            onClick={toggleBookmark}
          >
            <Bookmark
              className={`h-4 w-4 transition-all ${isBookmarked ? "fill-blue-500 text-blue-500" : "text-muted-foreground"}`}
            />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
