import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { connectToDatabase } = await import("@/lib/mongodb")
    const { ObjectId } = await import("mongodb")
    const { db } = await connectToDatabase()

    // Get body data
    const body = await request.json()
    const auctionId = body.auctionId

    if (!auctionId) {
      return NextResponse.json({ error: "Auction id is required" }, { status: 400 })
    }

    // Fetch auction
    const auction = await db.collection("auctions").findOne({ _id: new ObjectId(auctionId) })
    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Check if already ended
    if (auction.status === "ended") {
      return NextResponse.json({ message: "Auction already finalized" })
    }

    // Find highest bid
    const highestBid = await db
      .collection("bids")
      .find({ auctionId: new ObjectId(auctionId) })
      .sort({ amount: -1 })
      .limit(1)
      .toArray()

    let winnerId = null
    if (highestBid.length > 0) {
      winnerId = highestBid[0].bidderId // adjust based on your bids schema
    }

    // Update auction with winner and mark ended
    await db.collection("auctions").updateOne(
      { _id: new ObjectId(auctionId) },
      {
        $set: {
          status: "ended",
          winnerId: winnerId,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({
      message: "Auction finalized",
      winnerId: winnerId,
    })
  } catch (error) {
    console.error("Error finalizing auction:", error)
    return NextResponse.json({ error: "Unable to finalize auction" }, { status: 500 })
  }
}
