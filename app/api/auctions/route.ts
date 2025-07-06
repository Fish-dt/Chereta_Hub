import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status") || "active"

    const { db } = await connectToDatabase()

    // Build query
    const query: any = { status }

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Get total count
    const total = await db.collection("auctions").countDocuments(query)

    // Get auctions with pagination
    const auctions = await db
      .collection("auctions")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Add seller information
    const auctionsWithSeller = await Promise.all(
      auctions.map(async (auction) => {
        const seller = await db
          .collection("users")
          .findOne({ _id: auction.sellerId }, { projection: { firstName: 1, lastName: 1, avatar: 1 } })
        return {
          ...auction,
          seller: seller || { firstName: "Unknown", lastName: "User" },
        }
      }),
    )

    return NextResponse.json({
      auctions: auctionsWithSeller,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching auctions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    const body = await request.json()

    const auction = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      currentBid: body.startingBid,
      bidCount: 0,
      watchers: 0,
    }

    const result = await db.collection("auctions").insertOne(auction)

    return NextResponse.json({
      success: true,
      auctionId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating auction:", error)
    return NextResponse.json({ error: "Failed to create auction" }, { status: 500 })
  }
}
