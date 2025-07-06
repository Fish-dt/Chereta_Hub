import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get conversations where user is a participant
    const conversations = await db
      .collection("conversations")
      .find({ participants: decoded.userId })
      .sort({ lastMessageAt: -1 })
      .toArray()

    // Populate conversation details
    for (const conversation of conversations) {
      // Get other participant details
      const otherParticipantId = conversation.participants.find((id: string) => id !== decoded.userId)
      const otherParticipant = await db
        .collection("users")
        .findOne({ _id: new ObjectId(otherParticipantId) }, { projection: { firstName: 1, lastName: 1, avatar: 1 } })

      if (otherParticipant) {
        conversation.otherParticipant = {
          name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
          avatar: otherParticipant.avatar,
        }
      }

      // Get auction details
      if (conversation.auctionId) {
        const auction = await db
          .collection("auctions")
          .findOne({ _id: new ObjectId(conversation.auctionId) }, { projection: { title: 1 } })
        conversation.auction = auction
      }
    }

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { conversationId, message } = await request.json()

    if (!conversationId || !message) {
      return NextResponse.json({ error: "Conversation ID and message are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Verify user is part of the conversation
    const conversation = await db.collection("conversations").findOne({
      _id: new ObjectId(conversationId),
      participants: decoded.userId,
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Get user details to get firstName and lastName
    const { getUserById } = await import("@/lib/auth")
    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create message
    const messageData = {
      conversationId: new ObjectId(conversationId),
      senderId: decoded.userId,
      senderName: `${user.firstName} ${user.lastName}`,
      message: message.trim(),
      timestamp: new Date(),
      isRead: false,
    }

    await db.collection("messages").insertOne(messageData)

    // Update conversation last message time
    await db
      .collection("conversations")
      .updateOne({ _id: new ObjectId(conversationId) }, { $set: { lastMessageAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
