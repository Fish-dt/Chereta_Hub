import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const formData = await request.formData()

    const auctionData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      startingBid: Number.parseFloat(formData.get("startingBid") as string),
      reservePrice: formData.get("reservePrice") ? Number.parseFloat(formData.get("reservePrice") as string) : null,
      condition: formData.get("condition") as string,
      location: formData.get("location") as string,
      endTime: new Date(formData.get("endTime") as string),
      sellerId: decoded.userId,
      sellerName: `${decoded.firstName} ${decoded.lastName}`,
      currentBid: Number.parseFloat(formData.get("startingBid") as string),
      bidCount: 0,
      status: "pending_review", // New status for admin review
      images: [], // Will be populated after image processing
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Validate required fields
    if (
      !auctionData.title ||
      !auctionData.description ||
      !auctionData.category ||
      !auctionData.startingBid ||
      !auctionData.condition ||
      !auctionData.location
    ) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    // Validate end time
    if (auctionData.endTime <= new Date()) {
      return NextResponse.json({ error: "End time must be in the future" }, { status: 400 })
    }

    // Process images (simplified - in production, upload to cloud storage)
    const imageUrls: string[] = []
    for (let i = 0; i < 10; i++) {
      const image = formData.get(`image${i}`) as File
      if (image) {
        // In production, upload to cloud storage and get URL
        // For now, we'll use placeholder URLs
        imageUrls.push(`/placeholder.svg?height=400&width=400&text=Image${i + 1}`)
      }
    }

    auctionData.images = imageUrls

    const { db } = await connectToDatabase()
    const result = await db.collection("auctions").insertOne(auctionData)

    // Create notification for admins
    await db.collection("notifications").insertOne({
      type: "auction_review",
      title: "New Auction Pending Review",
      message: `Auction "${auctionData.title}" is waiting for approval`,
      recipientRole: "admin",
      auctionId: result.insertedId,
      isRead: false,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      auctionId: result.insertedId,
      message: "Auction created successfully and is pending review",
    })
  } catch (error) {
    console.error("Error creating auction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
