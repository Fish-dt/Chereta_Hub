import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get total bids
    const totalBids = await db.collection("bids").countDocuments({ bidderId: decoded.userId })

    // Get auctions won
    const auctionsWon = await db.collection("auctions").countDocuments({
      winnerId: decoded.userId,
      status: "completed",
    })

    // Get items sold
    const itemsSold = await db.collection("auctions").countDocuments({
      sellerId: decoded.userId,
      status: "completed",
    })

    // Calculate rating (simplified - in production, use actual reviews)
    const rating = 4.5 // Default rating

    const stats = {
      totalBids,
      auctionsWon,
      itemsSold,
      rating,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
