"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Gavel, Eye, DollarSign, Clock, Plus, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<{ activeBids: number; watchingItems: number; totalSpent: number; itemsSold: number } | null>(null)
  const [activeBids, setActiveBids] = useState<any[]>([])
  const [watchingItems, setWatchingItems] = useState<any[]>([])
  const [sellingItems, setSellingItems] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState<boolean>(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/login?callbackUrl=/dashboard")
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return
      try {
        setLoadingData(true)
        const res = await fetch("/api/user/dashboard", { cache: "no-store" })
        if (!res.ok) {
          throw new Error("Failed to load dashboard data")
        }
        const data = await res.json()
        setStats(data.stats)
        setActiveBids(Array.isArray(data.activeBids) ? data.activeBids : [])
        setWatchingItems(Array.isArray(data.watchingItems) ? data.watchingItems : [])
        setSellingItems(Array.isArray(data.sellingItems) ? data.sellingItems : [])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [session])

  if (status === "loading") {
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

  if (!session) {
    return null // Will redirect
  }

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
                <p className="text-2xl font-bold">{stats?.activeBids ?? 0}</p>
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
                <p className="text-2xl font-bold">{stats?.watchingItems ?? 0}</p>
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
                <p className="text-2xl font-bold">${(stats?.totalSpent ?? 0).toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{stats?.itemsSold ?? 0}</p>
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
                {loadingData && activeBids.length === 0 ? (
                  <p className="text-sm text-gray-500">Loading your active bids...</p>
                ) : activeBids.length === 0 ? (
                  <p className="text-sm text-gray-500">You have no active bids.</p>
                ) : activeBids.map((item) => (
                  <div key={(item.auctionId as string) || ""} className="flex items-center gap-4 p-4 border rounded-lg">
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
                        <span>Current: ${item.currentBid ?? 0}</span>
                        <span>Your bid: ${item.yourBid ?? 0}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.endTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={(item.yourBid ?? 0) >= (item.currentBid ?? 0) ? "default" : "destructive"}>
                        {(item.yourBid ?? 0) >= (item.currentBid ?? 0) ? "Winning" : "Outbid"}
                      </Badge>
                      <Button size="sm" asChild>
                        <Link href={`/auction/${item.auctionId}`}>View</Link>
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
                {loadingData && watchingItems.length === 0 ? (
                  <p className="text-sm text-gray-500">Loading your watchlist...</p>
                ) : watchingItems.length === 0 ? (
                  <p className="text-sm text-gray-500">Your watchlist is empty.</p>
                ) : watchingItems.map((item) => (
                  <div key={(item.auctionId as string) || ""} className="flex items-center gap-4 p-4 border rounded-lg">
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
                        <span>Current bid: ${item.currentBid ?? 0}</span>
                        <span>{item.bidCount ?? 0} bids</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.endTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/auction/${item.auctionId}`}>Place Bid</Link>
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
                {loadingData && sellingItems.length === 0 ? (
                  <p className="text-sm text-gray-500">Loading your listings...</p>
                ) : sellingItems.length === 0 ? (
                  <p className="text-sm text-gray-500">You have no active listings.</p>
                ) : sellingItems.map((item) => (
                  <div key={(item.auctionId as string) || ""} className="flex items-center gap-4 p-4 border rounded-lg">
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
                        <span>Current: ${item.currentBid ?? 0}</span>
                        <span>Starting: ${item.startingBid ?? 0}</span>
                        <span>{item.bidCount ?? 0} bids</span>
                        {typeof item.watchers === "number" && <span>{item.watchers} watching</span>}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.endTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/auction/${item.auctionId}`}>View</Link>
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
