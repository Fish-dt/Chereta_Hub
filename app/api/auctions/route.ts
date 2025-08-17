import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Lazy import to prevent build-time evaluation
    const { connectToDatabase } = await import("@/lib/mongodb")
    
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const status = searchParams.get("status") || "active"

    const query: any = { status }
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
    
    // Return empty results instead of 500 error for better UX
    return NextResponse.json({
      auctions: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
      },
      error: "Unable to fetch auctions at the moment. Please try again later.",
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { connectToDatabase } = await import("@/lib/mongodb")
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
    return NextResponse.json({ 
      error: "Failed to create auction. Please try again later." 
    }, { status: 500 })
  }
}
