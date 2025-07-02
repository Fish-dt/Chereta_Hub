import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { conversationId: string } }) {
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

    // Verify user is part of the conversation
    const conversation = await db.collection("conversations").findOne({
      _id: new ObjectId(params.conversationId),
      participants: decoded.userId,
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Get messages
    const messages = await db
      .collection("messages")
      .find({ conversationId: new ObjectId(params.conversationId) })
      .sort({ timestamp: 1 })
      .toArray()

    // Mark messages as read
    await db.collection("messages").updateMany(
      {
        conversationId: new ObjectId(params.conversationId),
        senderId: { $ne: decoded.userId },
        isRead: false,
      },
      { $set: { isRead: true } },
    )

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
