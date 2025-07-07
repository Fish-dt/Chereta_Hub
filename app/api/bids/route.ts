import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!user || !user.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { auctionId, bidAmount } = await request.json()

    if (!auctionId || !bidAmount) {
      return NextResponse.json({ error: "Auction ID and bid amount are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const auction = await db.collection("auctions").findOne({
      _id: new ObjectId(auctionId),
      status: "active",
    })

    if (!auction) {
      return NextResponse.json({ error: "Auction not found or not active" }, { status: 404 })
    }

    // Check if auction has ended
    if (new Date() > new Date(auction.endTime)) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 })
    }

    // Check if user is the seller
    if (auction.sellerId === user.id) {
      return NextResponse.json({ error: "You cannot bid on your own auction" }, { status: 400 })
    }

    // Check if bid is higher than current bid
    if (bidAmount <= auction.currentBid) {
      return NextResponse.json(
        {
          error: `Bid must be higher than current bid of $${auction.currentBid}`,
        },
        { status: 400 },
      )
    }

    // Get current highest bidder for notification
    const currentHighestBid = await db
      .collection("bids")
      .findOne({ auctionId: new ObjectId(auctionId) }, { sort: { bidAmount: -1 } })

    // Get user details to get firstName and lastName
    const { getUserById } = await import("@/lib/auth")
    const dbUser = await getUserById(user.id)
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create new bid
    const bidData = {
      auctionId: new ObjectId(auctionId),
      bidderId: user.id,
      bidderName: `${dbUser.firstName} ${dbUser.lastName}`,
      bidAmount: Number.parseFloat(bidAmount),
      timestamp: new Date(),
      isWinning: true, // This will be the highest bid
    }

    await db.collection("bids").insertOne(bidData)

    // Update previous winning bid
    if (currentHighestBid) {
      await db.collection("bids").updateOne({ _id: currentHighestBid._id }, { $set: { isWinning: false } })

      // Notify previous highest bidder they've been outbid
      await db.collection("notifications").insertOne({
        type: "outbid",
        title: "You've been outbid!",
        message: `Someone placed a higher bid on "${auction.title}". Current bid: $${bidAmount}`,
        recipientId: currentHighestBid.bidderId,
        auctionId: new ObjectId(auctionId),
        isRead: false,
        createdAt: new Date(),
      })
    }

    // Update auction with new current bid
    await db.collection("auctions").updateOne(
      { _id: new ObjectId(auctionId) },
      {
        $set: {
          currentBid: Number.parseFloat(bidAmount),
          updatedAt: new Date(),
        },
        $inc: { bidCount: 1 },
      },
    )

    // Notify seller of new bid
    await db.collection("notifications").insertOne({
      type: "new_bid",
      title: "New bid on your auction!",
      message: `${dbUser.firstName} ${dbUser.lastName} placed a bid of $${bidAmount} on "${auction.title}"`,
      recipientId: auction.sellerId,
      auctionId: new ObjectId(auctionId),
      isRead: false,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Bid placed successfully",
      currentBid: Number.parseFloat(bidAmount),
    })
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Error fetching bids:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
