import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://fisseha:9IxJhEy3A0RCH0ot@cluster0.ifvdbi6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function createSuperAdmin() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("auctionhub")

    // Check if super admin already exists
    const existingAdmin = await db.collection("users").findOne({ role: "admin" })

    if (existingAdmin) {
      console.log("❌ Super admin already exists:", existingAdmin.email)
      return
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const superAdmin = {
      email: "admin@auctionhub.com",
      password: hashedPassword,
      firstName: "Super",
      lastName: "Admin",
      avatar: null,
      role: "admin",
      rating: 5.0,
      totalSales: 0,
      memberSince: new Date(),
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(superAdmin)

    console.log("✅ Super admin created successfully!")
    console.log("📧 Email: admin@auctionhub.com")
    console.log("🔑 Password: admin123")
    console.log("🆔 User ID:", result.insertedId)

    // Create a sample moderator
    const hashedModPassword = await bcrypt.hash("mod123", 12)

    const moderator = {
      email: "moderator@auctionhub.com",
      password: hashedModPassword,
      firstName: "Sample",
      lastName: "Moderator",
      avatar: null,
      role: "moderator",
      rating: 4.8,
      totalSales: 0,
      memberSince: new Date(),
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const modResult = await db.collection("users").insertOne(moderator)

    console.log("✅ Sample moderator created!")
    console.log("📧 Email: moderator@auctionhub.com")
    console.log("🔑 Password: mod123")
    console.log("🆔 User ID:", modResult.insertedId)
  } catch (error) {
    console.error("❌ Error creating admin:", error)
  } finally {
    await client.close()
  }
}

createSuperAdmin()
