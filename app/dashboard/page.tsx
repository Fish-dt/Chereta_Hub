"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Gavel, Eye, DollarSign, Clock, Plus, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data
const userStats = {
  activeBids: 12,
  watchingItems: 34,
  totalSpent: 15420,
  itemsSold: 8,
}

const activeBids = [
  {
    id: "1",
    title: "Vintage Camera Collection",
    currentBid: 450,
    yourBid: 425,
    endTime: "2h 15m",
    image: "/placeholder.svg?height=80&width=80",
    status: "winning",
  },
  {
    id: "2",
    title: "Antique Pocket Watch",
    currentBid: 1200,
    yourBid: 1100,
    endTime: "1d 4h",
    image: "/placeholder.svg?height=80&width=80",
    status: "outbid",
  },
]

const watchingItems = [
  {
    id: "3",
    title: "Original Oil Painting",
    currentBid: 2500,
    endTime: "3d 12h",
    image: "/placeholder.svg?height=80&width=80",
    bidCount: 15,
  },
  {
    id: "4",
    title: "Rare Book Collection",
    currentBid: 800,
    endTime: "5d 8h",
    image: "/placeholder.svg?height=80&width=80",
    bidCount: 8,
  },
]

const sellingItems = [
  {
    id: "5",
    title: "Vintage Guitar",
    currentBid: 1800,
    startingBid: 1200,
    endTime: "2d 6h",
    image: "/placeholder.svg?height=80&width=80",
    bidCount: 23,
    watchers: 45,
  },
]

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your auctions, bids, and account</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bids</p>
                <p className="text-2xl font-bold">{userStats.activeBids}</p>
              </div>
              <Gavel className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Watching</p>
                <p className="text-2xl font-bold">{userStats.watchingItems}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">${userStats.totalSpent.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Sold</p>
                <p className="text-2xl font-bold">{userStats.itemsSold}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="bidding" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bidding">Bidding</TabsTrigger>
          <TabsTrigger value="watching">Watching</TabsTrigger>
          <TabsTrigger value="selling">Selling</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="bidding" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Bids</CardTitle>
              <CardDescription>Items you're currently bidding on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBids.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Current: ${item.currentBid}</span>
                        <span>Your bid: ${item.yourBid}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.endTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.status === "winning" ? "default" : "destructive"}>
                        {item.status === "winning" ? "Winning" : "Outbid"}
                      </Badge>
                      <Button size="sm" asChild>
                        <Link href={`/auction/${item.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watching" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Watching List</CardTitle>
              <CardDescription>Items you're interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {watchingItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Current bid: ${item.currentBid}</span>
                        <span>{item.bidCount} bids</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.endTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/auction/${item.id}`}>Place Bid</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="selling" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Listings</CardTitle>
                <CardDescription>Items you're selling</CardDescription>
              </div>
              <Button asChild>
                <Link href="/sell">
                  <Plus className="h-4 w-4 mr-2" />
                  List Item
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sellingItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Current: ${item.currentBid}</span>
                        <span>Starting: ${item.startingBid}</span>
                        <span>{item.bidCount} bids</span>
                        <span>{item.watchers} watching</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.endTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/auction/${item.id}`}>View</Link>
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Auction History</CardTitle>
              <CardDescription>Your completed auctions and purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>No completed auctions yet</p>
                <p className="text-sm mt-2">Your auction history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
