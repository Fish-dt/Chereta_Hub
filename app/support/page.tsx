"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react"
import Link from "next/link"

type SupportStats = {
  tickets: {
    total: number
    open: number
    inProgress: number
    resolved: number
    closed: number
  }
  priority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
  performance: {
    avgResponseTime: number
    avgResolutionTime: number
  }
}

type Ticket = {
  _id: string
  subject: string
  description: string
  priority: string
  status: string
  createdBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export default function SupportDashboardPage() {
  const [stats, setStats] = useState<SupportStats | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/support", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load support data")
        const data = await res.json()
        setStats(data.stats)
        setTickets(data.tickets || [])
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Dashboard</h1>
        <p className="text-gray-600">Manage support tickets, disputes, and resolutions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold">{stats?.tickets?.open || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{stats?.tickets?.inProgress || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{stats?.tickets?.resolved || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{stats?.performance?.avgResponseTime ? `${Math.round(stats.performance.avgResponseTime)}m` : "0m"}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
        </TabsList>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Tickets</CardTitle>
              <CardDescription>Manage user-reported issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading tickets...</p>
                ) : tickets.length === 0 ? (
                  <p className="text-sm text-gray-500">No tickets available.</p>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600">
                          Priority: {ticket.priority} • {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          ticket.status === "open" ? "destructive" : 
                          ticket.status === "in_progress" ? "secondary" : 
                          "default"
                        }>
                          {ticket.status}
                        </Badge>
                        <Button size="sm" asChild>
                          <Link href={`/support/tickets/${ticket._id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disputes Tab */}
        <TabsContent value="disputes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Priority Tickets</CardTitle>
              <CardDescription>High priority and urgent tickets requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading priority tickets...</p>
                ) : tickets.filter(t => t.priority === "high" || t.priority === "urgent").length === 0 ? (
                  <p className="text-sm text-gray-500">No priority tickets available.</p>
                ) : (
                  tickets.filter(t => t.priority === "high" || t.priority === "urgent").map((ticket) => (
                    <div key={ticket._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600">
                          Priority: {ticket.priority} • {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={ticket.priority === "urgent" ? "destructive" : "secondary"}>
                          {ticket.priority}
                        </Badge>
                        <Button size="sm" asChild>
                          <Link href={`/support/tickets/${ticket._id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
