"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Truck, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for deliveries
const deliveryStats = {
  pending: 5,
  inTransit: 3,
  delivered: 12,
  cancelled: 1,
}

const deliveryOrders = [
  {
    id: "1",
    item: "Vintage Guitar",
    buyer: "John Doe",
    status: "pending",
    shippingMethod: "Platform Delivery",
    address: "Addis Ababa, Ethiopia",
    endTime: "2d 6h",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "2",
    item: "Antique Watch",
    buyer: "Sara Ali",
    status: "in-transit",
    shippingMethod: "Platform Delivery",
    address: "Bahir Dar, Ethiopia",
    endTime: "1d 3h",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "3",
    item: "Original Oil Painting",
    buyer: "Mekdes T.",
    status: "delivered",
    shippingMethod: "Platform Delivery",
    address: "Hawassa, Ethiopia",
    endTime: "Completed",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState(deliveryOrders)

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
                <p className="text-2xl font-bold">{deliveryStats.pending}</p>
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
                <p className="text-2xl font-bold">{deliveryStats.inTransit}</p>
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
                <p className="text-2xl font-bold">{deliveryStats.delivered}</p>
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
                <p className="text-2xl font-bold">{deliveryStats.cancelled}</p>
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
          {orders.map((order) => (
            <Card key={order.id} className="mb-4">
              <CardContent className="flex items-center gap-4">
                <Image
                  src={order.image}
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
                    <Clock className="h-3 w-3" /> {order.endTime}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/delivery/${order.id}`}>View</Link>
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
            <OrderCard key={o.id} order={o} />
          ))}
        </TabsContent>

        <TabsContent value="in-transit" className="mt-6">
          {orders.filter(o => o.status === "in-transit").map(o => (
            <OrderCard key={o.id} order={o} />
          ))}
        </TabsContent>

        <TabsContent value="delivered" className="mt-6">
          {orders.filter(o => o.status === "delivered").map(o => (
            <OrderCard key={o.id} order={o} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Optional small reusable order card
function OrderCard({ order }: { order: typeof deliveryOrders[0] }) {
  return (
    <Card className="mb-4">
      <CardContent className="flex items-center gap-4">
        <Image
          src={order.image}
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
            <Clock className="h-3 w-3" /> {order.endTime}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/delivery/${order.id}`}>View</Link>
          </Button>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
