"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Mail, Star, Megaphone, Plus, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type MarketingStats = {
  campaigns: {
    total: number
    active: number
    paused: number
    completed: number
    totalBudget: number
    activeBudget: number
  }
  users: {
    total: number
    verified: number
    newThisMonth: number
    verificationRate: number
  }
  auctions: {
    total: number
    active: number
    completed: number
    totalRevenue: number
  }
}

type Campaign = {
  _id: string
  title: string
  description: string
  budget: number
  status: string
  startDate: string
  endDate: string
  targetAudience: string
  createdAt: string
}

export default function MarketingManagerDashboard() {
  const [stats, setStats] = useState<MarketingStats | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/marketing", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load marketing data")
        const data = await res.json()
        setStats(data.stats)
        setCampaigns(data.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])
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
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">{stats?.campaigns?.active || 0}</p>
              </div>
              <Megaphone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{stats?.users?.total || 0}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold">{stats?.users?.newThisMonth || 0}</p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${stats?.auctions?.totalRevenue?.toLocaleString() || 0}</p>
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
                {loading ? (
                  <p className="text-sm text-gray-500">Loading campaigns...</p>
                ) : campaigns.length === 0 ? (
                  <p className="text-sm text-gray-500">No campaigns available.</p>
                ) : (
                  campaigns.map((campaign) => (
                    <div key={campaign._id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Megaphone className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <p className="text-sm text-gray-600">{campaign.description}</p>
                        <p className="text-sm text-gray-500">Budget: ${campaign.budget} • Target: {campaign.targetAudience}</p>
                      </div>
                      <Badge variant={campaign.status === "active" ? "default" : campaign.status === "paused" ? "secondary" : "outline"}>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))
                )}
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
                {loading ? (
                  <p className="text-sm text-gray-500">Loading featured auctions...</p>
                ) : (
                  <p className="text-sm text-gray-500">No featured auctions available. This feature will be implemented soon.</p>
                )}
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
                {loading ? (
                  <p className="text-sm text-gray-500">Loading newsletters...</p>
                ) : (
                  <p className="text-sm text-gray-500">No newsletters available. This feature will be implemented soon.</p>
                )}
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
                {loading ? (
                  <p className="text-sm text-gray-500">Loading advertisements...</p>
                ) : (
                  <p className="text-sm text-gray-500">No advertisements available. This feature will be implemented soon.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
