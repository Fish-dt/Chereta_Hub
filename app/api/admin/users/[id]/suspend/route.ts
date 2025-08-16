import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Lazy import to prevent build-time evaluation
  const { requireAuth } = await import("@/lib/middleware")
  const getClientPromise = (await import("@/lib/mongodb")).default
  const { ObjectId } = await import("mongodb")
  
  const authResult = await requireAuth(request, "admin")
  if (authResult instanceof NextResponse) return authResult

  try {
    const client = await getClientPromise()
    const db = client.db("auctionhub")
    const userId = new ObjectId(params.id)

    const result = await db.collection("users").updateOne(
      { _id: userId },
      {
        $set: {
          isSuspended: true,
          suspendedAt: new Date(),
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
