import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { connectToDatabase } = await import("@/lib/mongodb")
    const { ObjectId } = await import("mongodb")
    const { db } = await connectToDatabase()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Auction id is required" }, { status: 400 })
    }

    let auction: any = null
    try {
      auction = await db.collection("auctions").findOne({ _id: new ObjectId(id) })
    } catch {
      return NextResponse.json({ error: "Invalid auction id" }, { status: 400 })
    }

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Attach seller details if available
    let seller: any = null
    if (auction.sellerId) {
      const sellerDoc = await db.collection("users").findOne({ _id: new ObjectId(auction.sellerId) })
      if (sellerDoc) {
        seller = {
          _id: sellerDoc._id.toString(),
          firstName: sellerDoc.firstName || "",
          lastName: sellerDoc.lastName || "",
          avatar: sellerDoc.avatar || null,
          rating: sellerDoc.rating ?? 0,
          totalSales: sellerDoc.totalSales ?? 0,
          memberSince: sellerDoc.memberSince ? new Date(sellerDoc.memberSince).toISOString().slice(0, 10) : "",
        }
      }
    }

    const responseAuction = {
      _id: auction._id.toString(),
      title: auction.title,
      description: auction.description || "",
      currentBid: auction.currentBid ?? auction.startingBid ?? 0,
      startingBid: auction.startingBid ?? 0,
      endTime: auction.endTime,
      images: auction.images || [],
      category: auction.category || "",
      condition: auction.condition || "",
      bidCount: auction.bidCount ?? 0,
      watchers: auction.watchers ?? 0,
      status: auction.status || "active",
      seller: seller || {
        _id: auction.sellerId?.toString?.() || "",
        firstName: (auction.sellerName || "").split(" ")[0] || "",
        lastName: (auction.sellerName || "").split(" ").slice(1).join(" ") || "",
        avatar: null,
        rating: 0,
        totalSales: 0,
        memberSince: "",
      },
      specifications: auction.specifications || undefined,
    }

    return NextResponse.json({ auction: responseAuction })
  } catch (error) {
    console.error("Error fetching auction by id:", error)
    return NextResponse.json({ error: "Unable to fetch auction" }, { status: 500 })
  }
}
