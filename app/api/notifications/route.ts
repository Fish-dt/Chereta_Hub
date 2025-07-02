import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get notifications for the user or their role
    const notifications = await db
      .collection("notifications")
      .find({
        $or: [{ recipientId: decoded.userId }, { recipientRole: decoded.role }],
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    const unreadCount = await db.collection("notifications").countDocuments({
      $or: [{ recipientId: decoded.userId }, { recipientRole: decoded.role }],
      isRead: false,
    })

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
