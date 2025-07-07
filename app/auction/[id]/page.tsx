"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Eye, Heart, Share2, Flag, User, Star, Gavel, Shield, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useLanguage } from "@/contexts/language-context"

interface Auction {
  _id: string
  title: string
  description: string
  currentBid: number
  startingBid: number
  endTime: string
  images: string[]
  category: string
  condition: string
  bidCount: number
  watchers: number
  status: string
  seller: {
    _id: string
    firstName: string
    lastName: string
    avatar?: string
    rating: number
    totalSales: number
    memberSince: string
  }
  specifications?: Record<string, string>
}

interface Bid {
  _id: string
  bidderName: string
  bidAmount: number
  timestamp: string
}

export default function AuctionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { t, language } = useLanguage()

  const [auction, setAuction] = useState<Auction | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [bidAmount, setBidAmount] = useState("")
  const [timeRemaining, setTimeRemaining] = useState("")
  const [isWatching, setIsWatching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bidLoading, setBidLoading] = useState(false)
  const [error, setError] = useState("")
  const [bidError, setBidError] = useState("")
  const [bidSuccess, setBidSuccess] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchAuction()
      fetchBids()
    }
  }, [params.id])

  useEffect(() => {
    if (auction) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const endTime = new Date(auction.endTime).getTime()
        const distance = endTime - now

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24))
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)

          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeRemaining("Auction ended")
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [auction])

  const fetchAuction = async () => {
    try {
      const response = await fetch(`/api/auctions/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setAuction(data.auction)
      } else {
        setError(data.error || "Failed to fetch auction")
      }
    } catch (error) {
      setError("Network error")
      console.error("Error fetching auction:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBids = async () => {
    try {
      const response = await fetch(`/api/bids?auctionId=${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setBids(data.bids || [])
      }
    } catch (error) {
      console.error("Error fetching bids:", error)
    }
  }

  const handlePlaceBid = async () => {
    if (!session) {
      router.push("/auth/login")
      return
    }

    if (!bidAmount || Number.parseFloat(bidAmount) <= auction!.currentBid) {
      setBidError(`Bid must be higher than current bid of $${auction!.currentBid}`)
      return
    }

    setBidLoading(true)
    setBidError("")
    setBidSuccess("")

    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionId: params.id,
          bidAmount: Number.parseFloat(bidAmount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBidSuccess("Bid placed successfully!")
        setBidAmount("")
        // Refresh auction and bids
        fetchAuction()
        fetchBids()
      } else {
        setBidError(data.error || "Failed to place bid")
      }
    } catch (error) {
      setBidError("Network error. Please try again.")
    } finally {
      setBidLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Auction not found"}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const minBidAmount = auction.currentBid + 1
  const isAuctionEnded = new Date() > new Date(auction.endTime)
  const isOwner = session && (session.user as any)?.id === auction.seller._id

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-8 min-h-[420px]">
        {/* Image Gallery */}
        <div className="space-y-4 flex flex-col items-center h-full justify-between">
          <div className="relative overflow-hidden rounded-lg bg-gray-100 w-full max-w-md aspect-[4/3] mx-auto h-full flex items-center justify-center">
            <Image
              src={auction.images && auction.images.length > 0 ? auction.images[selectedImage] : "/placeholder.jpg"}
              alt={auction.title}
              fill
              className="object-contain"
            />
          </div>
          {auction.images && auction.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {auction.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded border-2 w-16 h-16 ${
                    selectedImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.jpg"}
                    alt={`${auction.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auction Info */}
        <div className="space-y-6 h-full flex flex-col justify-between">
          <div>
            <Badge className="mb-2">{auction.category}</Badge>
            <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${language === "am" ? "font-amharic" : ""}`}>
              {auction.title}
            </h1>
            <p className={`text-gray-600 ${language === "am" ? "font-amharic" : ""}`}>{auction.description}</p>
          </div>

          {/* Current Bid */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className={`text-sm text-gray-500 ${language === "am" ? "font-amharic" : ""}`}>
                    {t("auction.currentBid")}
                  </p>
                  <p className="text-3xl font-bold text-green-600">${auction.currentBid.toLocaleString()}</p>
                </div>

              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Gavel className="h-4 w-4" />
                  {auction.bidCount} {t("auction.bids")}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {auction.watchers} watching
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {timeRemaining}
                </div>
              </div>

              {/* Bidding */}
              {!isAuctionEnded && !isOwner && (
                <div className="space-y-3">
                  {bidError && (
                    <Alert variant="destructive">
                      <AlertDescription>{bidError}</AlertDescription>
                    </Alert>
                  )}
                  {bidSuccess && (
                    <Alert>
                      <AlertDescription>{bidSuccess}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={`Min bid: $${minBidAmount.toLocaleString()}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="flex-1"
                      disabled={bidLoading}
                    />
                    <Button onClick={handlePlaceBid} disabled={bidLoading} className="px-8">
                      {bidLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Placing...
                        </>
                      ) : (
                        t("auction.placeBid")
                      )}
                    </Button>
                  </div>
                </div>
              )}
              {!isAuctionEnded && isOwner && (
                <div className="text-center py-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    You cannot bid on your own auction
                  </Badge>
                </div>
              )}

              {isAuctionEnded && (
                <div className="text-center py-4">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    {t("auction.ended")}
                  </Badge>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWatching(!isWatching)}
                  className={isWatching ? "text-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isWatching ? "fill-current" : ""}`} />
                  {isWatching ? "Watching" : "Watch"}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={auction.seller.avatar || "/placeholder.svg?height=40&width=40"} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className={`font-semibold ${language === "am" ? "font-amharic" : ""}`}>
                    {auction.seller.firstName} {auction.seller.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {auction.seller.rating}
                    </div>
                    <span>•</span>
                    <span>{auction.seller.totalSales} sales</span>
                    <span>•</span>
                    <span>Member since {auction.seller.memberSince}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="bidding">Bid History</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${language === "am" ? "font-amharic" : ""}`}>
                Item Description
              </h3>
              <div className="prose max-w-none">
                <p className={language === "am" ? "font-amharic" : ""}>{auction.description}</p>
                {auction.specifications && (
                  <div className="mt-6">
                    <h4 className={`font-semibold mb-3 ${language === "am" ? "font-amharic" : ""}`}>Specifications</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(auction.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="font-medium">{key}:</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bidding" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${language === "am" ? "font-amharic" : ""}`}>Bid History</h3>
              <div className="space-y-3">
                {bids.length > 0 ? (
                  bids.map((bid, index) => (
                    <div key={bid._id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <span className="font-medium">{bid.bidderName}</span>
                        <span className="text-sm text-gray-500 ml-2">{new Date(bid.timestamp).toLocaleString()}</span>
                      </div>
                      <span className="font-semibold text-green-600">${bid.bidAmount.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className={`text-gray-500 text-center py-4 ${language === "am" ? "font-amharic" : ""}`}>
                    No bids yet. Be the first to bid!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${language === "am" ? "font-amharic" : ""}`}>
                Shipping & Returns
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium mb-2 ${language === "am" ? "font-amharic" : ""}`}>Shipping Options</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Standard Shipping (5-7 days)</span>
                      <span>$25.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Shipping (2-3 days)</span>
                      <span>$45.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overnight Shipping</span>
                      <span>$85.00</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className={`font-medium mb-2 ${language === "am" ? "font-amharic" : ""}`}>Return Policy</h4>
                  <p className={`text-sm text-gray-600 ${language === "am" ? "font-amharic" : ""}`}>
                    30-day return policy. Item must be returned in original condition. Buyer pays return shipping unless
                    item is not as described.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Shield className="h-4 w-4" />
                  <span>Protected by CheretaHub Buyer Protection</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
