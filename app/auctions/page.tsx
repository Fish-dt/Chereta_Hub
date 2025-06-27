"use client"

import { useState } from "react"
import { AuctionCard } from "@/components/auction-card"
import { AuctionFilters } from "@/components/auction-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

// Mock data - replace with actual API call
const mockAuctions = [
  {
    id: "1",
    title: "Vintage Rolex Submariner",
    description: "Rare 1960s Rolex Submariner in excellent condition",
    currentBid: 15000,
    startingBid: 8000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    image: "/placeholder.svg?height=300&width=400",
    category: "Jewelry",
    bidCount: 23,
    watchers: 156,
    seller: "WatchCollector",
  },
  {
    id: "2",
    title: "Original Picasso Sketch",
    description: "Authenticated original sketch by Pablo Picasso, 1952",
    currentBid: 45000,
    startingBid: 25000,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    image: "/placeholder.svg?height=300&width=400",
    category: "Art",
    bidCount: 67,
    watchers: 234,
    seller: "ArtDealer",
  },
  // Add more mock auctions...
]

export default function AuctionsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("ending-soon")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <AuctionFilters />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Auctions</h1>
              <p className="text-gray-600">Showing 1,234 active auctions</p>
            </div>

            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="newly-listed">Newly Listed</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="most-bids">Most Bids</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auction Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Auctions
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
