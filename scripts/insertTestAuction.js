// scripts/insertTestAuction.js
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

async function run() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "chereta"; // fallback if not set

  if (!uri) {
    throw new Error('Missing environment variable: MONGODB_URI');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const auctions = db.collection("auctions");

    const now = new Date();
    const twoMinutesLater = new Date(now.getTime() + 2 * 60 * 1000);

    const auction = {
      title: "Luxury Villa in Bole, Addis Ababa",
      description:
        "Stunning modern villa located in the heart of Bole, Addis Ababa. Featuring spacious living areas, elegant design, private garden, and premium security—perfect for luxury living or investment.",
      startingBid: 500000,
      condition: "excellent",
      location: "ethiopia",
      endTime: twoMinutesLater,
      sellerId: new ObjectId("68b82dfd0871878e1c4c0480"),
      sellerName: "Fisiha Desta",
      currentBid: 500000,
      bidCount: 0,
      status: "active",
      images: ["/auctions/villa.jpg"],
      createdAt: now,
      updatedAt: now,
      rejectionReason: null,
      reviewedAt: now,
      reviewedBy: new ObjectId("686a58c8b6ff22962000ff6f"),
      acceptanceDeadline: null,
      bidderQueue: [],
      disputePaused: false,
      sellerRejected: false,
      winnerId: null,
    };

    const result = await auctions.insertOne(auction);
    console.log("Inserted test auction with _id:", result.insertedId);
  } catch (err) {
    console.error("Error inserting auction:", err);
  } finally {
    await client.close();
  }
}

run();
