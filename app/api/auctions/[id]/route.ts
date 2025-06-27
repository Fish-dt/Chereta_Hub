import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("auctionhub")

    const auction = await db.collection("auctions").findOne({ _id: new ObjectId(params.id) })

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    return NextResponse.json(auction)
  } catch (error) {
    console.error("Error fetching auction:", error)
    return NextResponse.json({ error: "Failed to fetch auction" }, { status: 500 })
  }
}
