import { MongoClient } from "mongodb"

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

async function seedDatabase() {
  try {
    await client.connect()
    const db = client.db("auctionhub")

    // Seed categories
    const categories = [
      {
        name: "Art & Collectibles",
        description: "Paintings, sculptures, and collectible items",
        icon: "palette",
        itemCount: 0,
      },
      { name: "Vehicles", description: "Cars, motorcycles, and automotive items", icon: "car", itemCount: 0 },
      { name: "Jewelry & Watches", description: "Fine jewelry and luxury timepieces", icon: "gem", itemCount: 0 },
      { name: "Electronics", description: "Computers, phones, and electronic devices", icon: "laptop", itemCount: 0 },
      { name: "Home & Garden", description: "Furniture, decor, and garden items", icon: "home", itemCount: 0 },
      { name: "Fashion", description: "Clothing, shoes, and accessories", icon: "shirt", itemCount: 0 },
    ]

    await db.collection("categories").insertMany(categories)

    // Seed sample auctions
    const sampleAuctions = [
      {
        title: "Vintage Rolex Submariner 1960s",
        description:
          "Rare 1960s Rolex Submariner in excellent condition. This timepiece has been carefully maintained and comes with original box and papers.",
        category: "Jewelry & Watches",
        condition: "Excellent",
        images: ["/placeholder.svg?height=500&width=500"],
        startingBid: 8000,
        currentBid: 15000,
        buyNowPrice: 25000,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        sellerId: "temp-seller-id",
        status: "active",
        bidCount: 23,
        watchers: 156,
        specifications: {
          Brand: "Rolex",
          Model: "Submariner",
          Year: "1960s",
          "Case Material": "Stainless Steel",
          Movement: "Automatic",
          "Water Resistance": "200m",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Original Picasso Sketch",
        description: "Authenticated original sketch by Pablo Picasso, 1952. Comes with certificate of authenticity.",
        category: "Art & Collectibles",
        condition: "Excellent",
        images: ["/placeholder.svg?height=500&width=500"],
        startingBid: 25000,
        currentBid: 45000,
        buyNowPrice: 75000,
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        sellerId: "temp-seller-id",
        status: "active",
        bidCount: 67,
        watchers: 234,
        specifications: {
          Artist: "Pablo Picasso",
          Year: "1952",
          Medium: "Pencil on paper",
          Dimensions: '12" x 16"',
          Provenance: "Private collection",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("auctions").insertMany(sampleAuctions)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
