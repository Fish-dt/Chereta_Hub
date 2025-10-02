import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { getServerSession } = await import("next-auth/next")
    const { getAuthOptions } = await import("@/lib/auth-config")

    const session = await getServerSession(await getAuthOptions())
    const user = session?.user as any
    if (!user || !user.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { connectToDatabase } = await import("@/lib/mongodb")
    const { ObjectId } = await import("mongodb")
    const { db } = await connectToDatabase()

    const userIdStr = String(user.id)

    // Active bids: latest bid per auction by this user, join auction details
    const activeBids = await db
      .collection("bids")
      .aggregate([
        { $match: { bidderId: userIdStr } },
        { $sort: { createdAt: -1 } },
        // keep latest bid per auction by this user
        {
          $group: {
            _id: "$auctionId",
            latestBid: { $first: "$$ROOT" },
          },
        },
        // Normalize auctionId to ObjectId if possible
        {
          $addFields: {
            auctionObjectId: {
              $cond: [
                { $eq: [{ $type: "$_id" }, "objectId"] },
                "$_id",
                {
                  $cond: [
                    { $and: [{ $eq: [{ $type: "$_id" }, "string"] }, { $regexMatch: { input: "$_id", regex: /^[a-fA-F0-9]{24}$/ } }] },
                    { $toObjectId: "$_id" },
                    null,
                  ],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: "auctions",
            localField: "auctionObjectId",
            foreignField: "_id",
            as: "auction",
          },
        },
        { $unwind: { path: "$auction", preserveNullAndEmptyArrays: true } },
        // compute currentBid/bidCount on the fly in case not stored
        {
          $lookup: {
            from: "bids",
            let: { aId: "$auction._id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$auctionId", "$$aId"] } } },
              {
                $group: {
                  _id: "$auctionId",
                  currentBid: { $max: "$amount" },
                  bidCount: { $sum: 1 },
                },
              },
            ],
            as: "bidStats",
          },
        },
        {
          $addFields: {
            currentBid: { $ifNull: [{ $arrayElemAt: ["$bidStats.currentBid", 0] }, "$auction.currentBid"] },
            bidCount: { $ifNull: [{ $arrayElemAt: ["$bidStats.bidCount", 0] }, "$auction.bidCount"] },
          },
        },
        {
          $project: {
            _id: 0,
            auctionId: "$auction._id",
            title: "$auction.title",
            image: { $ifNull: [{ $arrayElemAt: ["$auction.images", 0] }, null] },
            yourBid: "$latestBid.amount",
            currentBid: 1,
            bidCount: 1,
            endTime: "$auction.endTime",
            status: "$auction.status",
          },
        },
      ])
      .toArray()

    // Watching list (optional collection)
    let watchingItems: any[] = []
    const collections = await db.listCollections().toArray()
    const hasWatchlist = collections.some((c: any) => c.name === "watchlist")
    if (hasWatchlist) {
      watchingItems = await db
        .collection("watchlist")
        .aggregate([
          { $match: { userId: userIdStr } },
          {
            $lookup: {
              from: "auctions",
              localField: "auctionId",
              foreignField: "_id",
              as: "auction",
            },
          },
          { $unwind: "$auction" },
          // compute current bid stats
          {
            $lookup: {
              from: "bids",
              let: { aId: "$auction._id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$auctionId", "$$aId"] } } },
                {
                  $group: {
                    _id: "$auctionId",
                    currentBid: { $max: "$amount" },
                    bidCount: { $sum: 1 },
                  },
                },
              ],
              as: "bidStats",
            },
          },
          {
            $addFields: {
              currentBid: { $ifNull: [{ $arrayElemAt: ["$bidStats.currentBid", 0] }, "$auction.currentBid"] },
              bidCount: { $ifNull: [{ $arrayElemAt: ["$bidStats.bidCount", 0] }, "$auction.bidCount"] },
            },
          },
          {
            $project: {
              _id: 0,
              auctionId: "$auction._id",
              title: "$auction.title",
              image: { $ifNull: [{ $arrayElemAt: ["$auction.images", 0] }, null] },
              currentBid: 1,
              bidCount: 1,
              endTime: "$auction.endTime",
            },
          },
        ])
        .toArray()
    }

    // Selling items for this user
    const sellingItems = await db
      .collection("auctions")
      .aggregate([
        { $match: { sellerId: userIdStr } },
        {
          $lookup: {
            from: "bids",
            let: { aId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$auctionId", "$$aId"] } } },
              {
                $group: {
                  _id: "$auctionId",
                  currentBid: { $max: "$amount" },
                  bidCount: { $sum: 1 },
                },
              },
            ],
            as: "bidStats",
          },
        },
        {
          $addFields: {
            currentBid: { $ifNull: [{ $arrayElemAt: ["$bidStats.currentBid", 0] }, "$currentBid"] },
            bidCount: { $ifNull: [{ $arrayElemAt: ["$bidStats.bidCount", 0] }, "$bidCount"] },
          },
        },
        {
          $project: {
            _id: 0,
            auctionId: "$_id",
            title: 1,
            image: { $ifNull: [{ $arrayElemAt: ["$images", 0] }, null] },
            currentBid: 1,
            startingBid: 1,
            bidCount: 1,
            watchers: 1,
            endTime: 1,
            status: 1,
          },
        },
      ])
      .toArray()

    // High-level stats
    const activeBidsCount = activeBids.length
    const watchingCount = watchingItems.length
    const itemsSold = await db.collection("auctions").countDocuments({ sellerId: userIdStr, status: "completed" })

    let totalSpent = 0
    if (activeBids.length > 0) {
      // Example placeholder: sum of user's highest bid per auction (active only)
      totalSpent = activeBids.reduce((sum: number, b: any) => sum + (b.yourBid || 0), 0)
    }

    return NextResponse.json({
      stats: {
        activeBids: activeBidsCount,
        watchingItems: watchingCount,
        totalSpent,
        itemsSold,
      },
      activeBids,
      watchingItems,
      sellingItems,
    })
  } catch (error) {
    console.error("Error building user dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


