// scripts/migrateAuctions.js
import { connectToDatabase } from '../lib/mongodb.js'
import { ObjectId } from 'mongodb'

async function migrate() {
  const { db } = await connectToDatabase()
  const auctions = db.collection('auctions')

  const allAuctions = await auctions.find({}).toArray()

  for (const auction of allAuctions) {
    await auctions.updateOne(
      { _id: auction._id },
      {
        $set: {
          winnerId: auction.winnerId || null,
          acceptanceDeadline: auction.acceptanceDeadline || null,
          bidderQueue: auction.bidderQueue || [],
          sellerRejected: auction.sellerRejected || false,
          disputePaused: auction.disputePaused || false,
          status: auction.status || 'open',
          endTime: auction.endTime || new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      }
    )
  }

  console.log('Migration completed!')
  process.exit(0)
}

migrate().catch((err) => console.error(err))
