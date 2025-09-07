import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { connectToDatabase } = await import("@/lib/mongodb")
    const { ObjectId } = await import("mongodb")
    const { db } = await connectToDatabase()

    // Get auctionId from body
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

    // Already ended?
    if (auction.status === "ended") {
      return NextResponse.json({ message: "Auction already finalized", winnerId: auction.winnerId || null })
    }

    // Get highest bid for this auction
    const highestBid = await db
      .collection("bids")
      .find({ auctionId: auctionId }) // store auctionId as string
      .sort({ amount: -1 })
      .limit(1)
      .toArray()

    let winnerId: string | null = null
    if (highestBid.length > 0) {
      winnerId = highestBid[0].bidderId
    }

    // Update auction
    await db.collection("auctions").updateOne(
      { _id: new ObjectId(auctionId) },
      {
        $set: {
          status: "ended",
          winnerId: winnerId ? new ObjectId(winnerId) : null,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({
      message: "Auction finalized",
      winnerId,
    })
  } catch (error) {
    console.error("Error finalizing auction:", error)
    return NextResponse.json({ error: "Unable to finalize auction" }, { status: 500 })
  }
}
