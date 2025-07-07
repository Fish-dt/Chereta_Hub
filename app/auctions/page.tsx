"use client"

import { useState, useEffect, useRef } from "react"
import { AuctionCard } from "@/components/auction-card"
import { AuctionFilters } from "@/components/auction-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Auction {
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

export default function AuctionsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("ending-soon")
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { t, language } = useLanguage()
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery])

  useEffect(() => {
    fetchAuctions()
  }, [debouncedSearch, sortBy])

  const fetchAuctions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: debouncedSearch,
        sort: sortBy,
        status: "active",
      })

      const response = await fetch(`/api/auctions?${params}`)
      const data = await response.json()

      if (response.ok) {
        setAuctions(data.auctions || [])
      } else {
        setError(data.error || "Failed to fetch auctions")
      }
    } catch (error) {
      setError("Network error")
      console.error("Error fetching auctions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className={language === "am" ? "font-amharic" : ""}>{t("common.loading")}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAuctions}>Try Again</Button>
        </div>
      </div>
    )
  }

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
              <h1 className={`text-3xl font-bold text-gray-900 ${language === "am" ? "font-amharic" : ""}`}>
                {t("nav.auctions")}
              </h1>
              <p className={`text-gray-600 ${language === "am" ? "font-amharic" : ""}`}>
                Showing {auctions.length} active auctions
              </p>
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
          {auctions.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {auctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`text-gray-500 text-lg ${language === "am" ? "font-amharic" : ""}`}>
                No auctions found. Try adjusting your search criteria.
              </p>
            </div>
          )}

          {/* Load More */}
          {auctions.length > 0 && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Auctions
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
