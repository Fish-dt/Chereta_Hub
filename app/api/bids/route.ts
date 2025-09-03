import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Lazy import to prevent build-time evaluation
  const { connectToDatabase } = await import("@/lib/mongodb")
  const { getServerSession } = await import("next-auth/next")
  const { getAuthOptions } = await import("@/lib/auth-config")
  
  try {
    const session = await getServerSession(await getAuthOptions())
    const user = session?.user as any
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { auctionId, amount } = await request.json()
    if (!auctionId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Check if auction exists and is active
    const auction = await db.collection("auctions").findOne({ _id: auctionId })
    if (!auction || auction.status !== "active") {
      return NextResponse.json({ error: "Auction not found or not active" }, { status: 400 })
    }

    // Check if auction has ended
    if (new Date() > new Date(auction.endDate)) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 })
    }

    // Check if user is not bidding on their own auction
    if (auction.sellerId === user.id) {
      return NextResponse.json({ error: "Cannot bid on your own auction" }, { status: 400 })
    }

    // Check if bid is higher than current highest bid
    const highestBid = await db.collection("bids").findOne(
      { auctionId },
      { sort: { amount: -1 } }
    )
    
    if (highestBid && amount <= highestBid.amount) {
      return NextResponse.json({ error: "Bid must be higher than current highest bid" }, { status: 400 })
    }

    // Create bid
    const bid = {
      auctionId,
      bidderId: user.id,
      amount,
      createdAt: new Date(),
    }

    await db.collection("bids").insertOne(bid)

    // Update auction with new highest bid
    await db.collection("auctions").updateOne(
      { _id: auctionId },
      { $set: { currentBid: amount, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true, bid })
  } catch (error) {
    console.error("Error creating bid:", error)
    return NextResponse.json({ error: "Failed to create bid" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Lazy import to prevent build-time evaluation
  const { connectToDatabase } = await import("@/lib/mongodb")
  const { ObjectId } = await import("mongodb")
  
  try {
    const { searchParams } = new URL(request.url)
    const auctionId = searchParams.get("auctionId")

    if (!auctionId) {
      return NextResponse.json({ error: "Auction ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const bids = await db
      .collection("bids")
      .find({ auctionId: new ObjectId(auctionId) })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Error fetching bids:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
