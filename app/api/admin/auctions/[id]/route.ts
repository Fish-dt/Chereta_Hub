import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { requireAuth } from "@/lib/middleware"
import clientPromise from "@/lib/mongodb"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth(request, "moderator")
  if (authResult instanceof NextResponse) return authResult

  try {
    const client = await clientPromise
    const db = client.db("auctionhub")

    const result = await db.collection("auctions").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Auction deleted successfully" })
  } catch (error) {
    console.error("Error deleting auction:", error)
    return NextResponse.json({ error: "Failed to delete auction" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth(request, "moderator")
  if (authResult instanceof NextResponse) return authResult

  try {
    const client = await clientPromise
    const db = client.db("auctionhub")
    const { status } = await request.json()

    const result = await db.collection("auctions").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Auction updated successfully" })
  } catch (error) {
    console.error("Error updating auction:", error)
    return NextResponse.json({ error: "Failed to update auction" }, { status: 500 })
  }
}
