import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const client = await clientPromise
    const db = client.db("auctionhub")

    const body = await request.json()
    const {
      title,
      description,
      category,
      condition,
      startingBid,
      buyNowPrice,
      duration,
      images,
      specifications,
      shippingInfo,
    } = body

    // Validation
    if (!title || !description || !category || !startingBid || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (startingBid < 1) {
      return NextResponse.json({ error: "Starting bid must be at least $1" }, { status: 400 })
    }

    if (buyNowPrice && buyNowPrice <= startingBid) {
      return NextResponse.json({ error: "Buy now price must be higher than starting bid" }, { status: 400 })
    }

    const endTime = new Date()
    endTime.setHours(endTime.getHours() + Number.parseInt(duration))

    const auction = {
      title,
      description,
      category,
      condition: condition || "Used",
      images: images || [],
      startingBid: Number.parseFloat(startingBid),
      currentBid: Number.parseFloat(startingBid),
      buyNowPrice: buyNowPrice ? Number.parseFloat(buyNowPrice) : null,
      endTime,
      sellerId: authResult.user._id,
      sellerName: `${authResult.user.firstName} ${authResult.user.lastName}`,
      status: "active",
      bidCount: 0,
      watchers: 0,
      specifications: specifications || {},
      shippingInfo: shippingInfo || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("auctions").insertOne(auction)

    return NextResponse.json({
      success: true,
      auctionId: result.insertedId,
      message: "Auction created successfully",
    })
  } catch (error) {
    console.error("Error creating auction:", error)
    return NextResponse.json({ error: "Failed to create auction" }, { status: 500 })
  }
}
