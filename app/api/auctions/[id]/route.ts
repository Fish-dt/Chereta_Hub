import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Lazy import to prevent build-time evaluation
  const { connectToDatabase } = await import("@/lib/mongodb")
  const { ObjectId } = await import("mongodb")
  
  try {
    const { db } = await connectToDatabase()
    const auctionId = new ObjectId(params.id)

    const auction = await db.collection("auctions").findOne({ _id: auctionId })
    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Get seller information
    const seller = await db
      .collection("users")
      .findOne(
        { _id: auction.sellerId },
        { projection: { password: 0, email: 0 } }
      )

    // Get bids for this auction
    const bids = await db
      .collection("bids")
      .find({ auctionId: auctionId })
      .sort({ amount: -1 })
      .toArray()

    const auctionWithDetails = {
      ...auction,
      seller: seller || { firstName: "Unknown", lastName: "User" },
      bids,
    }

    return NextResponse.json(auctionWithDetails)
  } catch (error) {
    console.error("Error fetching auction:", error)
    return NextResponse.json({ error: "Failed to fetch auction" }, { status: 500 })
  }
}
