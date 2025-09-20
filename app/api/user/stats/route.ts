import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { getAuthOptions } from "@/lib/auth-config"

export async function GET(request: NextRequest) {
  try {
    // Get session via NextAuth
    const session = await getServerSession(await getAuthOptions())
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userEmail = session.user.email

    // Lazy import MongoDB
    const { connectToDatabase } = await import("@/lib/mongodb")
    const { db } = await connectToDatabase()

    // Fetch stats
    const totalBids = await db.collection("bids").countDocuments({ bidderEmail: userEmail })
    const auctionsWon = await db.collection("auctions").countDocuments({
      winnerEmail: userEmail,
      status: "completed",
    })
    const itemsSold = await db.collection("auctions").countDocuments({
      sellerEmail: userEmail,
      status: "completed",
    })

    // Default rating
    const rating = 4.5

    // Optional: fetch user balance
    const user = await db.collection("users").findOne({ email: userEmail }, { projection: { balance: 1 } })
    const balance = user?.balance || 0

    const stats = { totalBids, auctionsWon, itemsSold, rating, balance }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
