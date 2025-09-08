import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { connectToDatabase } = await import("@/lib/mongodb");
    const { db } = await connectToDatabase();

    const { auctionId } = await request.json();
    if (!auctionId)
      return NextResponse.json({ error: "Auction ID required" }, { status: 400 });

    const auction = await db.collection("auctions").findOne({ _id: new ObjectId(auctionId) });
    if (!auction) return NextResponse.json({ error: "Auction not found" }, { status: 404 });

    // Fetch highest bid
    const highestBidArr = await db
      .collection("bids")
      .find({ auctionId })
      .sort({ amount: -1 })
      .limit(1)
      .toArray();

    const highestBid = highestBidArr[0];
    const winnerId = highestBid ? highestBid.bidderId : null;

    const sellerId = auction.sellerId;

    // Send notifications
    const notifications: any[] = [];

    if (winnerId) {
      notifications.push({
        recipientId: new ObjectId(winnerId),
        type: "auction_won",
        message: `You have won the auction for "${auction.title}" with a bid of $${highestBid.amount}.`,
        isRead: false,
        createdAt: new Date(),
      });
    }

    if (sellerId) {
      notifications.push({
        recipientId: new ObjectId(sellerId),
        type: "auction_ended",
        message: `Your auction "${auction.title}" has ended. The winning bid was $${highestBid?.amount ?? 0}.`,
        isRead: false,
        createdAt: new Date(),
      });
    }

    if (notifications.length > 0) {
      await db.collection("notifications").insertMany(notifications);
    }

    // Send emails
    if (winnerId) {
      const winner = await db.collection("users").findOne({ _id: new ObjectId(winnerId) });
      if (winner?.email) {
        await sendEmail(
          winner.email,
          "Congratulations! You won the auction",
          `You have won the auction for "${auction.title}" with a bid of $${highestBid.amount}.`
        );
      }
    }

    if (sellerId) {
      const seller = await db.collection("users").findOne({ _id: new ObjectId(sellerId) });
      if (seller?.email) {
        await sendEmail(
          seller.email,
          "Your auction has ended",
          `Your auction "${auction.title}" has ended. The winning bid was $${highestBid?.amount ?? 0}.`
        );
      }
    }

    // Update auction
    await db.collection("auctions").updateOne(
      { _id: new ObjectId(auctionId) },
      { $set: { status: "ended", winnerId, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, winnerId });
  } catch (error) {
    console.error("Error finalizing auction:", error);
    return NextResponse.json({ error: "Failed to finalize auction" }, { status: 500 });
  }
}
