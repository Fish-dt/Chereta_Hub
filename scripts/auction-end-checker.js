import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/auction-site"

async function checkEndedAuctions() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()

    console.log("Checking for ended auctions...")

    // Find auctions that have ended but are still active
    const endedAuctions = await db
      .collection("auctions")
      .find({
        status: "active",
        endTime: { $lte: new Date() },
      })
      .toArray()

    console.log(`Found ${endedAuctions.length} ended auctions`)

    for (const auction of endedAuctions) {
      console.log(`Processing auction: ${auction.title}`)

      // Find the winning bid
      const winningBid = await db.collection("bids").findOne({ auctionId: auction._id }, { sort: { bidAmount: -1 } })

      if (winningBid) {
        // Update auction status to completed
        await db.collection("auctions").updateOne(
          { _id: auction._id },
          {
            $set: {
              status: "completed",
              winnerId: winningBid.bidderId,
              winnerName: winningBid.bidderName,
              finalPrice: winningBid.bidAmount,
              completedAt: new Date(),
            },
          },
        )

        // Create conversation between winner and seller
        const conversationData = {
          participants: [auction.sellerId, winningBid.bidderId],
          auctionId: auction._id,
          createdAt: new Date(),
          lastMessageAt: new Date(),
        }

        const conversationResult = await db.collection("conversations").insertOne(conversationData)

        // Send initial message
        await db.collection("messages").insertOne({
          conversationId: conversationResult.insertedId,
          senderId: "system",
          senderName: "CheretaHub System",
          message: `Congratulations! The auction for "${auction.title}" has ended. Winner: ${winningBid.bidderName} with a bid of $${winningBid.bidAmount}. Please coordinate payment and delivery details.`,
          timestamp: new Date(),
          isRead: false,
        })

        // Notify winner
        await db.collection("notifications").insertOne({
          type: "auction_won",
          title: "Congratulations! You won an auction!",
          message: `You won the auction for "${auction.title}" with a bid of $${winningBid.bidAmount}. Please contact the seller to arrange payment and delivery.`,
          recipientId: winningBid.bidderId,
          auctionId: auction._id,
          isRead: false,
          createdAt: new Date(),
        })

        // Notify seller
        await db.collection("notifications").insertOne({
          type: "auction_sold",
          title: "Your auction has ended!",
          message: `Your auction for "${auction.title}" has ended successfully. Winner: ${winningBid.bidderName} with a bid of $${winningBid.bidAmount}. Please contact the buyer to arrange payment and delivery.`,
          recipientId: auction.sellerId,
          auctionId: auction._id,
          isRead: false,
          createdAt: new Date(),
        })

        console.log(`✅ Auction "${auction.title}" completed successfully. Winner: ${winningBid.bidderName}`)
      }
      } else {
        // No bids received
        await db.collection("auctions").updateOne(
          { _id: auction._id },
          {
            $set: {
              status: "ended_no_bids",
              completedAt: new Date(),
            },
          },
        )

        // Notify seller
        await db.collection("notifications").insertOne({
          type: "auction_ended",
          title: "Your auction has ended",
          message: `Your auction for "${auction.title}" has ended with no bids received.`,
          recipientId: auction.sellerId,
          auctionId: auction._id,
          isRead: false,
          createdAt: new Date(),
        })

        console.log(`📭 Auction "${auction.title}" ended with no bids`)
      }
    }

    console.log("✅ Auction end checking completed")
  } catch (error) {
    console.error("❌ Error checking ended auctions:", error)
  } finally {
    await client.close()
  }
}

// Run the checker
checkEndedAuctions()
