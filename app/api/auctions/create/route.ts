import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getServerSession } from "next-auth"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    // Try NextAuth session first
    const { getAuthOptions } = await import("@/lib/auth-config")
    const session = await getServerSession(await getAuthOptions())

    // Fallback to custom JWT cookie if no NextAuth session
    let authenticatedUserId: string | null = null
    if (session?.user && (session.user as any).id) {
      authenticatedUserId = (session.user as any).id as string
    } else {
      const token = request.cookies.get("auth-token")?.value
      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }
      authenticatedUserId = decoded.userId
    }

    // Get user details to get firstName and lastName
    const { getUserById } = await import("@/lib/auth")
    const user = await getUserById(authenticatedUserId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const formData = await request.formData()

    const auctionData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      startingBid: Number.parseFloat(formData.get("startingBid") as string),
      condition: formData.get("condition") as string,
      location: formData.get("location") as string,
      endTime: new Date(formData.get("endTime") as string),
      sellerId: authenticatedUserId,
      sellerName: `${user.firstName} ${user.lastName}`,
      currentBid: Number.parseFloat(formData.get("startingBid") as string),
      bidCount: 0,
      status: "pending_review", // New status for admin review
      images: [] as string[], // Will be populated after image processing
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

    // Process images and save to public/auctions/
    const imageUrls: string[] = []
    const uploadDir = path.join(process.cwd(), "public", "auctions")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    for (let i = 0; i < 10; i++) {
      const image = formData.get(`image${i}`) as File
      if (image && image.size > 0) {
        const arrayBuffer = await image.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const ext = image.type.split("/").pop() || "jpg"
        const fileName = `auction_${Date.now()}_${i}.${ext}`
        const filePath = path.join(uploadDir, fileName)
        fs.writeFileSync(filePath, buffer)
        imageUrls.push(`/auctions/${fileName}`)
      }
    }

    auctionData.images = imageUrls

    // Lazy import to prevent build-time evaluation
    const { connectToDatabase } = await import("@/lib/mongodb")

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
