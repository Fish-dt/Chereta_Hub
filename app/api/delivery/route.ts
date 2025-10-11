import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/middleware")
    const { getClient } = await import("@/lib/mongodb")
    
    const authResult = await requireAuth(request, "delivery")
    if (authResult instanceof NextResponse) return authResult

    const client = await getClient()
    const db = client.db("auctionhub")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status")

    // Build query based on status filter
    const query: any = status ? { status } : {}
    
    // Fetch delivery orders with pagination
    const orders = await db
      .collection("deliveries")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection("deliveries").countDocuments(query)

    // Get delivery statistics
    const statsAgg = await db.collection("deliveries").aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]).toArray()

    const toCount = (key: string) => statsAgg.find((s: any) => s._id === key)?.count || 0

    return NextResponse.json({
      stats: {
        pending: toCount("pending"),
        inTransit: toCount("in-transit"),
        delivered: toCount("delivered"),
        cancelled: toCount("cancelled"),
      },
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching delivery dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/middleware")
    const { getClient } = await import("@/lib/mongodb")
    
    const authResult = await requireAuth(request, "delivery")
    if (authResult instanceof NextResponse) return authResult

    const client = await getClient()
    const db = client.db("auctionhub")
    const { ObjectId } = await import("mongodb")

    const body = await request.json()
    const { orderId, status, notes, location } = body

    if (!orderId || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 })
    }

    // Update delivery status
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (notes) updateData.notes = notes
    if (location) updateData.location = location

    const result = await db.collection("deliveries").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Delivery order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Delivery status updated" })
  } catch (error) {
    console.error("Error updating delivery status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



