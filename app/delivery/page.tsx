"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Truck, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Types
type DeliveryStats = { pending: number; inTransit: number; delivered: number; cancelled: number }
type DeliveryOrder = {
  _id: string
  item: string
  buyer: string
  status: "pending" | "in-transit" | "delivered" | "cancelled"
  shippingMethod: string
  address: string
  eta?: string | null
  image?: string
}

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [stats, setStats] = useState<DeliveryStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/delivery", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load deliveries")
        const data = await res.json()
        setStats(data.stats)
        setOrders(Array.isArray(data.orders) ? data.orders : [])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Dashboard</h1>
        <p className="text-gray-600">Manage shipping and fulfillment of sold items</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats?.pending ?? 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold">{stats?.inTransit ?? 0}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold">{stats?.delivered ?? 0}</p>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold">{stats?.cancelled ?? 0}</p>
              </div>
              <Truck className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for orders */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-transit">In Transit</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {loading && orders.length === 0 ? (
            <p className="text-sm text-gray-500">Loading delivery orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-500">No delivery orders available.</p>
          ) : orders.map((order) => (
            <Card key={order._id} className="mb-4">
              <CardContent className="flex items-center gap-4">
                <Image
                  src={order.image || "/placeholder.svg"}
                  alt={order.item}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{order.item}</h3>
                  <p className="text-sm text-gray-600">
                    Buyer: {order.buyer} | Address: {order.address} | Shipping: {order.shippingMethod}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> {order.eta || "--"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/delivery/${order._id}`}>View</Link>
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {orders.filter(o => o.status === "pending").map(o => (
            <OrderCard key={o._id} order={o} />
          ))}
        </TabsContent>

        <TabsContent value="in-transit" className="mt-6">
          {orders.filter(o => o.status === "in-transit").map(o => (
            <OrderCard key={o._id} order={o} />
          ))}
        </TabsContent>

        <TabsContent value="delivered" className="mt-6">
          {orders.filter(o => o.status === "delivered").map(o => (
            <OrderCard key={o._id} order={o} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Optional small reusable order card
function OrderCard({ order }: { order: DeliveryOrder }) {
  return (
    <Card className="mb-4">
      <CardContent className="flex items-center gap-4">
        <Image
          src={order.image || "/placeholder.svg"}
          alt={order.item}
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{order.item}</h3>
          <p className="text-sm text-gray-600">
            Buyer: {order.buyer} | Address: {order.address} | Shipping: {order.shippingMethod}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3" /> {order.eta || "--"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/delivery/${order._id}`}>View</Link>
          </Button>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
