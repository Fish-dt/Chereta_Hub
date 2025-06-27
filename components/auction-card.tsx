import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Gavel, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface AuctionCardProps {
  auction: {
    id: string
    title: string
    description: string
    currentBid: number
    startingBid: number
    endTime: Date
    image: string
    category: string
    bidCount: number
    watchers: number
    seller: string
  }
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const timeRemaining = Math.max(0, auction.endTime.getTime() - Date.now())
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative">
        <Image
          src={auction.image || "/placeholder.svg"}
          alt={auction.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-4 left-4 bg-blue-600">{auction.category}</Badge>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-sm">
            <Eye className="h-3 w-3" />
            {auction.watchers}
          </div>
          <Button size="icon" variant="ghost" className="bg-black/70 hover:bg-black/80 text-white h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardHeader>
        <Link href={`/auction/${auction.id}`}>
          <h3 className="text-xl font-semibold line-clamp-1 hover:text-blue-600 transition-colors">{auction.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2">{auction.description}</p>
        <p className="text-sm text-gray-500">by {auction.seller}</p>
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
          <span>{timeRemaining > 0 ? `${days}d ${hours}h ${minutes}m remaining` : "Auction ended"}</span>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/auction/${auction.id}`}>
              <Gavel className="h-4 w-4 mr-2" />
              {timeRemaining > 0 ? "Place Bid" : "View Results"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
