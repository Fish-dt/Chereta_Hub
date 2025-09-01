"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react"
import Link from "next/link"

// Mock data
const supportStats = {
  openTickets: 14,
  pendingDisputes: 6,
  resolvedCases: 120,
  responseTime: "1h 25m",
}

const tickets = [
  {
    id: "101",
    user: "John Doe",
    subject: "Payment not processed",
    status: "open",
    createdAt: "2h ago",
  },
  {
    id: "102",
    user: "Mary Jane",
    subject: "Unable to bid on item",
    status: "pending",
    createdAt: "5h ago",
  },
]

const disputes = [
  {
    id: "201",
    buyer: "Chris Evans",
    seller: "Sarah Connor",
    reason: "Item not delivered",
    status: "open",
    createdAt: "1d ago",
  },
  {
    id: "202",
    buyer: "Tony Stark",
    seller: "Bruce Wayne",
    reason: "Damaged product received",
    status: "pending",
    createdAt: "3d ago",
  },
]

export default function SupportDashboardPage() {
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
                <p className="text-2xl font-bold">{supportStats.openTickets}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Disputes</p>
                <p className="text-2xl font-bold">{supportStats.pendingDisputes}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Cases</p>
                <p className="text-2xl font-bold">{supportStats.resolvedCases}</p>
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
                <p className="text-2xl font-bold">{supportStats.responseTime}</p>
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
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{ticket.subject}</h3>
                      <p className="text-sm text-gray-600">
                        By {ticket.user} • {ticket.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          ticket.status === "open" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/support/tickets/${ticket.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disputes Tab */}
        <TabsContent value="disputes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Disputes</CardTitle>
              <CardDescription>Handle buyer-seller disputes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disputes.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{d.reason}</h3>
                      <p className="text-sm text-gray-600">
                        Buyer: {d.buyer} • Seller: {d.seller} • {d.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          d.status === "open" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {d.status}
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/support/disputes/${d.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
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
