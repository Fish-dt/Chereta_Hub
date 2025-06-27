import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("auctionhub")

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "ending-soon"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // Build query
    const query: any = { status: "active" }

    if (category) {
      query.category = category
    }

    if (search) {
      query.$text = { $search: search }
    }

    // Build sort
    let sortQuery: any = {}
    switch (sort) {
      case "ending-soon":
        sortQuery = { endTime: 1 }
        break
      case "newly-listed":
        sortQuery = { createdAt: -1 }
        break
      case "price-low":
        sortQuery = { currentBid: 1 }
        break
      case "price-high":
        sortQuery = { currentBid: -1 }
        break
      case "most-bids":
        sortQuery = { bidCount: -1 }
        break
      default:
        sortQuery = { endTime: 1 }
    }

    const auctions = await db
      .collection("auctions")
      .find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection("auctions").countDocuments(query)

    return NextResponse.json({
      auctions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching auctions:", error)
    return NextResponse.json({ error: "Failed to fetch auctions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("auctionhub")

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
