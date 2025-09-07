import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { connectToDatabase } = await import("@/lib/mongodb");
  const { getServerSession } = await import("next-auth/next");
  const { getAuthOptions } = await import("@/lib/auth-config");

  try {
    const session = await getServerSession(await getAuthOptions());
    const user = session?.user;

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auctionId, amount } = await request.json();
    if (!auctionId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Check if auction exists and is active
    const auction = await db.collection("auctions").findOne({ _id: new ObjectId(auctionId) });
    if (!auction || auction.status !== "active") {
      return NextResponse.json({ error: "Auction not found or not active" }, { status: 400 });
    }

    // Check if auction has ended
    if (new Date() > new Date(auction.endTime)) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 });
    }

    // Prevent bidding on own auction
    if (auction.sellerName === user.name || auction.sellerId === user.email) {
      return NextResponse.json({ error: "Cannot bid on your own auction" }, { status: 400 });
    }

    // Get highest bid
    const highestBid = await db.collection("bids").findOne(
      { auctionId },
      { sort: { amount: -1 } }
    );

    if (highestBid && amount <= highestBid.amount) {
      return NextResponse.json({ error: "Bid must be higher than current highest bid" }, { status: 400 });
    }
    
    const remainingMs = new Date(auction.endTime).getTime() - new Date().getTime();
    if (remainingMs <= 60000) { // last 60 seconds
      await db.collection("auctions").updateOne(
        { _id: new ObjectId(auctionId) },
        { $set: { endTime: new Date(Date.now() + 60000) } }
      );
    }


    // Insert bid
    const bid = {
      auctionId,
      bidderEmail: user.email,
      bidderName: user.name,
      amount,
      createdAt: new Date(),
    };

    await db.collection("bids").insertOne(bid);

    // Update auction
    await db.collection("auctions").updateOne(
      { _id: new ObjectId(auctionId) },
      {
        $set: { currentBid: amount, updatedAt: new Date() },
        $inc: { bidCount: 1 },
      }
    );

    // Return success and updated auction
    return NextResponse.json({ success: true, bid });
  } catch (error) {
    console.error("Error creating bid:", error);
    return NextResponse.json({ error: "Failed to create bid" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { connectToDatabase } = await import("@/lib/mongodb")

  try {
    const { searchParams } = new URL(request.url)
    const auctionId = searchParams.get("auctionId")
    if (!auctionId) {
      return NextResponse.json({ error: "Auction ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Fetch latest 10 bids sorted descending
    const bids = await db.collection("bids")
      .find({ auctionId })
      .sort({ createdAt: -1 })
      .limit(10)
      .project({
        _id: 1,
        bidderName: 1,
        bidAmount: "$amount",
        timestamp: "$createdAt"
      })
      .toArray()

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Error fetching bids:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
