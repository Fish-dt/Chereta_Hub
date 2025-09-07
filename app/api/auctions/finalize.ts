import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const { auctionId } = await request.json();
  if (!auctionId) return NextResponse.json({ error: "Auction ID required" }, { status: 400 });

  const { db } = await connectToDatabase();

  // 1. Get the highest bid
  const highestBid = await db.collection("bids")
    .find({ auctionId })
    .sort({ amount: -1 })
    .limit(1)
    .toArray();

  const winnerId = highestBid.length ? highestBid[0].bidderId : null;

  // 2. Update auction
  await db.collection("auctions").updateOne(
    { _id: new ObjectId(auctionId) },
    { $set: { status: "ended", winnerId, updatedAt: new Date() } }
  );

  return NextResponse.json({ success: true, winnerId });
}
