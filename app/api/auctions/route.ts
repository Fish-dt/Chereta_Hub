import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Lazy import to prevent build-time evaluation
  const { connectToDatabase } = await import("@/lib/mongodb")
  
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const query: any = { status: "active" }
    if (category && category !== "all") {
      query.category = category
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

    const auctions = await db
      .collection("auctions")
      .find(query)
      .sort(sortOptions)
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
