import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Lazy import to prevent build-time evaluation
    const { connectToDatabase } = await import("@/lib/mongodb")
    const { ObjectId } = await import("mongodb")

    const { db } = await connectToDatabase()

    await db
      .collection("notifications")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { isRead: true, readAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
