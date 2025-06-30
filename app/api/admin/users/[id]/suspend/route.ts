import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { requireAuth } from "@/lib/middleware"
import clientPromise from "@/lib/mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth(request, "moderator")
  if (authResult instanceof NextResponse) return authResult

  try {
    const client = await clientPromise
    const db = client.db("auctionhub")

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          isSuspended: true,
          suspendedAt: new Date(),
          suspendedBy: authResult.user._id,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "User suspended successfully" })
  } catch (error) {
    console.error("Error suspending user:", error)
    return NextResponse.json({ error: "Failed to suspend user" }, { status: 500 })
  }
}
