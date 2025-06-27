"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Eye, Heart, Share2, Flag, User, Star, Gavel, Shield } from "lucide-react"

// Mock auction data
const mockAuction = {
  id: "1",
  title: "Vintage Rolex Submariner 1960s",
  description:
    "Rare 1960s Rolex Submariner in excellent condition. This timepiece has been carefully maintained and comes with original box and papers. A true collector's item with historical significance.",
  currentBid: 15000,
  startingBid: 8000,
  buyNowPrice: 25000,
  endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  images: [
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ],
  category: "Jewelry & Watches",
  condition: "Excellent",
  bidCount: 23,
  watchers: 156,
  seller: {
    name: "WatchCollector",
    rating: 4.9,
    totalSales: 127,
    memberSince: "2019",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  specifications: {
    Brand: "Rolex",
    Model: "Submariner",
    Year: "1960s",
    "Case Material": "Stainless Steel",
    Movement: "Automatic",
    "Water Resistance": "200m",
  },
  bidHistory: [
    { bidder: "User***23", amount: 15000, time: "2 minutes ago" },
    { bidder: "Collector***89", amount: 14500, time: "15 minutes ago" },
    { bidder: "Watch***45", amount: 14000, time: "1 hour ago" },
  ],
}

export default function AuctionDetailPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [bidAmount, setBidAmount] = useState("")
  const [timeRemaining, setTimeRemaining] = useState("")
  const [isWatching, setIsWatching] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const endTime = mockAuction.endTime.getTime()
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
  }, [])

  const handlePlaceBid = () => {
    // Handle bid placement logic
    console.log("Placing bid:", bidAmount)
  }

  const minBidAmount = mockAuction.currentBid + 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={mockAuction.images[selectedImage] || "/placeholder.svg"}
              alt={mockAuction.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {mockAuction.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative overflow-hidden rounded border-2 ${
                  selectedImage === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${mockAuction.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Auction Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{mockAuction.category}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockAuction.title}</h1>
            <p className="text-gray-600">{mockAuction.description}</p>
          </div>

          {/* Current Bid */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Current Bid</p>
                  <p className="text-3xl font-bold text-green-600">${mockAuction.currentBid.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Buy It Now</p>
                  <p className="text-xl font-semibold text-blue-600">${mockAuction.buyNowPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Gavel className="h-4 w-4" />
                  {mockAuction.bidCount} bids
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {mockAuction.watchers} watching
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {timeRemaining}
                </div>
              </div>

              {/* Bidding */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={`Min bid: $${minBidAmount.toLocaleString()}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handlePlaceBid} className="px-8">
                    Place Bid
                  </Button>
                </div>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Buy It Now - ${mockAuction.buyNowPrice.toLocaleString()}
                </Button>
              </div>

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
                  <AvatarImage src={mockAuction.seller.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{mockAuction.seller.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {mockAuction.seller.rating}
                    </div>
                    <span>•</span>
                    <span>{mockAuction.seller.totalSales} sales</span>
                    <span>•</span>
                    <span>Member since {mockAuction.seller.memberSince}</span>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="bidding">Bid History</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Item Description</h3>
              <div className="prose max-w-none">
                <p>{mockAuction.description}</p>
                <p className="mt-4">
                  This exceptional timepiece represents the pinnacle of Swiss watchmaking from the 1960s. The Rolex
                  Submariner has been meticulously maintained and serviced by certified technicians. All original
                  components are intact, including the iconic rotating bezel and luminous markers.
                </p>
                <p className="mt-4">
                  Condition notes: Minor surface scratches consistent with age, crystal is original and clear, movement
                  keeps excellent time within COSC standards. This watch comes with original box, papers, and a
                  certificate of authenticity.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(mockAuction.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bidding" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Bid History</h3>
              <div className="space-y-3">
                {mockAuction.bidHistory.map((bid, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <span className="font-medium">{bid.bidder}</span>
                      <span className="text-sm text-gray-500 ml-2">{bid.time}</span>
                    </div>
                    <span className="font-semibold text-green-600">${bid.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Shipping Options</h4>
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
                  <h4 className="font-medium mb-2">Return Policy</h4>
                  <p className="text-sm text-gray-600">
                    30-day return policy. Item must be returned in original condition. Buyer pays return shipping unless
                    item is not as described.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Shield className="h-4 w-4" />
                  <span>Protected by AuctionHub Buyer Protection</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
