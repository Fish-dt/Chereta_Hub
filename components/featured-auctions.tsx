import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Gavel } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - in real app, this would come from your MongoDB
const featuredAuctions = [
  {
    id: "1",
    title: "Vintage Rolex Submariner",
    description: "Rare 1960s Rolex Submariner in excellent condition",
    currentBid: 15000,
    startingBid: 8000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
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
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    image: "/placeholder.svg?height=300&width=400",
    category: "Art",
    bidCount: 67,
    watchers: 234,
    seller: "ArtDealer",
  },
  {
    id: "3",
    title: "1967 Ford Mustang Fastback",
    description: "Fully restored classic Mustang with original V8 engine",
    currentBid: 32000,
    startingBid: 20000,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    image: "/placeholder.svg?height=300&width=400",
    category: "Vehicles",
    bidCount: 45,
    watchers: 189,
    seller: "ClassicCars",
  },
]

export function FeaturedAuctions() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Auctions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Don't miss out on these premium items ending soon</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredAuctions.map((auction) => (
            <Card key={auction.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <Image
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-blue-600">{auction.category}</Badge>
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  <Eye className="h-3 w-3" />
                  {auction.watchers}
                </div>
              </div>

              <CardHeader>
                <h3 className="text-xl font-semibold line-clamp-1">{auction.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{auction.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-2xl font-bold text-green-600">${auction.currentBid.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Bids</p>
                    <p className="text-lg font-semibold">{auction.bidCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Ends in 2d 14h 32m</span>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/auction/${auction.id}`}>
                      <Gavel className="h-4 w-4 mr-2" />
                      Place Bid
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/auctions">View All Auctions</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
