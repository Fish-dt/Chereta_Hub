import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("auctionhub")

    const { auctionId, bidAmount, userId } = await request.json()

    // Validate bid amount
    const auction = await db.collection("auctions").findOne({ _id: new ObjectId(auctionId) })

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    if (bidAmount <= auction.currentBid) {
      return NextResponse.json({ error: "Bid must be higher than current bid" }, { status: 400 })
    }

    if (new Date() > new Date(auction.endTime)) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 })
    }

    // Create bid record
    const bid = {
      auctionId: new ObjectId(auctionId),
      userId,
      amount: bidAmount,
      timestamp: new Date(),
    }

    await db.collection("bids").insertOne(bid)

    // Update auction
    await db.collection("auctions").updateOne(
      { _id: new ObjectId(auctionId) },
      {
        $set: {
          currentBid: bidAmount,
          updatedAt: new Date(),
        },
        $inc: { bidCount: 1 },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 })
  }
}
