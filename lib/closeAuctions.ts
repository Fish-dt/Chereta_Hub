import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function closeEndedAuctions() {
  const { db } = await connectToDatabase();
  const now = new Date();

  const endedAuctions = await db.collection("auctions").find({
    status: "active",
    endTime: { $lte: now }
  }).toArray();

  for (const auction of endedAuctions) {
    const highestBid = await db.collection("bids")
      .find({ auctionId: auction._id.toString() })
      .sort({ amount: -1 })
      .limit(1)
      .toArray();

    const winnerId = highestBid[0]?.bidderId || null;

    await db.collection("auctions").updateOne(
      { _id: new ObjectId(auction._id) },
      {
        $set: {
          status: "closed",
          winnerId,
          acceptanceDeadline: winnerId ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
        }
      }
    );

    console.log(`Auction ${auction._id} closed. Winner: ${winnerId ?? "none"}`);
  }
}
