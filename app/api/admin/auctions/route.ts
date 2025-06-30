import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request, "moderator")
  if (authResult instanceof NextResponse) return authResult

  try {
    const client = await clientPromise
    const db = client.db("auctionhub")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")

    const query: any = {}
    if (status && status !== "all") {
      query.status = status
    }

    const auctions = await db
      .collection("auctions")
      .find(query)
      .sort({ createdAt: -1 })
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
