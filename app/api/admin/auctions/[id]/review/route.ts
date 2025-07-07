import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAuth } from "@/lib/middleware"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth(request, "moderator")
  if (authResult instanceof NextResponse) return authResult

  try {
    const { action, reason } = await request.json()

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const auctionId = new ObjectId(params.id)

    // Get auction details
    const auction = await db.collection("auctions").findOne({ _id: auctionId })
    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Update auction status
    const newStatus = action === "approve" ? "active" : "rejected"
    await db.collection("auctions").updateOne(
      { _id: auctionId },
      {
        $set: {
          status: newStatus,
          reviewedBy: authResult.user._id,
          reviewedAt: new Date(),
          rejectionReason: action === "reject" ? reason : null,
          updatedAt: new Date(),
        },
      },
    )

    // Create notification for seller
    const notificationMessage =
      action === "approve"
        ? `Your auction "${auction.title}" has been approved and is now live!`
        : `Your auction "${auction.title}" has been rejected. Reason: ${reason || "Not specified"}`

    await db.collection("notifications").insertOne({
      type: "auction_status",
      title: action === "approve" ? "Auction Approved" : "Auction Rejected",
      message: notificationMessage,
      recipientId: auction.sellerId,
      auctionId: auctionId,
      isRead: false,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: `Auction ${action}d successfully`,
    })
  } catch (error) {
    console.error("Error reviewing auction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
