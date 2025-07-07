import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!user || !user.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get notifications for the user only
    const notifications = await db
      .collection("notifications")
      .find({ recipientId: user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    const unreadCount = await db.collection("notifications").countDocuments({
      recipientId: user.id,
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
