"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Mail, Star, Megaphone, Plus, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock stats
const marketingStats = {
  activePromotions: 5,
  featuredAuctions: 12,
  newslettersSent: 34,
  adRevenue: 15420,
}

// Mock data
const promotions = [
  {
    id: "1",
    title: "Summer Sale Campaign",
    reach: "12,500 users",
    status: "active",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "2",
    title: "Collector’s Week Promo",
    reach: "8,300 users",
    status: "scheduled",
    image: "/placeholder.svg?height=80&width=80",
  },
]

const featuredAuctions = [
  {
    id: "3",
    title: "Vintage Car Auction",
    views: 5200,
    bids: 45,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "4",
    title: "Rare Coin Collection",
    views: 2100,
    bids: 18,
    image: "/placeholder.svg?height=80&width=80",
  },
]

const newsletters = [
  {
    id: "5",
    subject: "Weekly Auction Highlights",
    sentTo: "15,000 subscribers",
    status: "sent",
  },
  {
    id: "6",
    subject: "Upcoming Rare Item Auction",
    sentTo: "14,200 subscribers",
    status: "draft",
  },
]

const advertisements = [
  {
    id: "7",
    platform: "Google Ads",
    spend: "$1,200",
    clicks: 320,
    conversions: 45,
  },
  {
    id: "8",
    platform: "Facebook Ads",
    spend: "$850",
    clicks: 210,
    conversions: 28,
  },
]

export default function MarketingManagerDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Manager Dashboard</h1>
        <p className="text-gray-600">Manage promotions, featured auctions, newsletters, and advertisements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                <p className="text-2xl font-bold">{marketingStats.activePromotions}</p>
              </div>
              <Megaphone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Auctions</p>
                <p className="text-2xl font-bold">{marketingStats.featuredAuctions}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Newsletters Sent</p>
                <p className="text-2xl font-bold">{marketingStats.newslettersSent}</p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ad Revenue</p>
                <p className="text-2xl font-bold">${marketingStats.adRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="promotions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          <TabsTrigger value="ads">Advertisements</TabsTrigger>
        </TabsList>

        {/* Promotions */}
        <TabsContent value="promotions" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Promotions</CardTitle>
                <CardDescription>Manage and track marketing campaigns</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Promotion
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotions.map((promo) => (
                  <div key={promo.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{promo.title}</h3>
                      <p className="text-sm text-gray-600">Reach: {promo.reach}</p>
                    </div>
                    <Badge variant={promo.status === "active" ? "default" : "secondary"}>{promo.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Featured Auctions */}
        <TabsContent value="featured" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Auctions</CardTitle>
              <CardDescription>Highlight auctions for more visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featuredAuctions.map((auction) => (
                  <div key={auction.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Image
                      src={auction.image}
                      alt={auction.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{auction.title}</h3>
                      <p className="text-sm text-gray-600">{auction.views} views • {auction.bids} bids</p>
                    </div>
                    <Button size="sm" variant="outline">Manage</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Newsletters */}
        <TabsContent value="newsletters" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Newsletters</CardTitle>
                <CardDescription>Engage your subscribers</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Newsletter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsletters.map((nl) => (
                  <div key={nl.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{nl.subject}</h3>
                      <p className="text-sm text-gray-600">Sent to: {nl.sentTo}</p>
                    </div>
                    <Badge variant={nl.status === "sent" ? "default" : "secondary"}>{nl.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads */}
        <TabsContent value="ads" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advertisements</CardTitle>
              <CardDescription>Track ad campaigns and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advertisements.map((ad) => (
                  <div key={ad.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{ad.platform}</h3>
                      <p className="text-sm text-gray-600">
                        Spend: {ad.spend} • Clicks: {ad.clicks} • Conversions: {ad.conversions}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
