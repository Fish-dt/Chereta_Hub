import { MongoClient } from "mongodb"

const uri =
  "mongodb+srv://fisseha:9IxJhEy3A0RCH0ot@cluster0.ifvdbi6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function testConnection() {
  const client = new MongoClient(uri)

  try {
    console.log("Connecting to MongoDB Atlas...")
    await client.connect()
    console.log("✅ Connected successfully to MongoDB Atlas!")

    // Test database operations
    const db = client.db("auctionhub")
    const collections = await db.listCollections().toArray()
    console.log(
      "📁 Available collections:",
      collections.map((c) => c.name),
    )

    // Create collections if they don't exist
    const requiredCollections = ["users", "auctions", "bids", "watchlist", "categories"]

    for (const collectionName of requiredCollections) {
      const exists = collections.some((c) => c.name === collectionName)
      if (!exists) {
        await db.createCollection(collectionName)
        console.log(`✨ Created collection: ${collectionName}`)
      }
    }

    console.log("🎉 Database setup complete!")
  } catch (error) {
    console.error("❌ Connection failed:", error)
  } finally {
    await client.close()
  }
}

testConnection()
