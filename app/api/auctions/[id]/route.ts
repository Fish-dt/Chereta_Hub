import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, context: any) {
  const { params } = await context;
  try {
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid auction ID" }, { status: 400 })
    }

    const auction = await db.collection("auctions").findOne({ _id: new ObjectId(params.id) })

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Get seller information
    const seller = await db.collection("users").findOne(
      { _id: new ObjectId(auction.sellerId) },
      {
        projection: {
          firstName: 1,
          lastName: 1,
          avatar: 1,
          rating: 1,
          totalSales: 1,
          createdAt: 1,
        },
      },
    )

    if (seller) {
      auction.seller = {
        ...seller,
        rating: seller.rating || 4.5,
        totalSales: seller.totalSales || 0,
        memberSince: new Date(seller.createdAt).getFullYear().toString(),
      }
    }

    return NextResponse.json({ auction })
  } catch (error) {
    console.error("Error fetching auction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
