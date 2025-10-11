import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/middleware")
    const { getClient } = await import("@/lib/mongodb")
    
    const authResult = await requireAuth(request, "marketing")
    if (authResult instanceof NextResponse) return authResult

    const client = await getClient()
    const db = client.db("auctionhub")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status")
    const type = searchParams.get("type") // campaigns, analytics, users

    // Build query based on filters
    const query: any = {}
    if (status) query.status = status
    if (type) query.type = type

    let collection = "campaigns"
    if (type === "analytics") collection = "analytics"
    if (type === "users") collection = "users"

    // Fetch campaigns/analytics with pagination
    const data = await db
      .collection(collection)
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection(collection).countDocuments(query)

    // Get marketing statistics
    const campaignStats = await db.collection("campaigns").aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalBudget: { $sum: "$budget" },
        },
      },
    ]).toArray()

    const userStats = await db.collection("users").aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          verifiedUsers: { $sum: { $cond: ["$isVerified", 1, 0] } },
          newUsersThisMonth: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", new Date(new Date().setMonth(new Date().getMonth() - 1))] },
                1,
                0
              ]
            }
          }
        }
      }
    ]).toArray()

    const auctionStats = await db.collection("auctions").aggregate([
      {
        $group: {
          _id: null,
          totalAuctions: { $sum: 1 },
          activeAuctions: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          completedAuctions: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          totalRevenue: { $sum: "$finalPrice" }
        }
      }
    ]).toArray()

    const toCount = (key: string) => campaignStats.find((s: any) => s._id === key)?.count || 0
    const toBudget = (key: string) => campaignStats.find((s: any) => s._id === key)?.totalBudget || 0

    const userData = userStats[0] || { totalUsers: 0, verifiedUsers: 0, newUsersThisMonth: 0 }
    const auctionData = auctionStats[0] || { totalAuctions: 0, activeAuctions: 0, completedAuctions: 0, totalRevenue: 0 }

    return NextResponse.json({
      stats: {
        campaigns: {
          total: campaignStats.reduce((sum, s) => sum + s.count, 0),
          active: toCount("active"),
          paused: toCount("paused"),
          completed: toCount("completed"),
          totalBudget: campaignStats.reduce((sum, s) => sum + s.totalBudget, 0),
          activeBudget: toBudget("active"),
        },
        users: {
          total: userData.totalUsers,
          verified: userData.verifiedUsers,
          newThisMonth: userData.newUsersThisMonth,
          verificationRate: userData.totalUsers > 0 ? (userData.verifiedUsers / userData.totalUsers) * 100 : 0,
        },
        auctions: {
          total: auctionData.totalAuctions,
          active: auctionData.activeAuctions,
          completed: auctionData.completedAuctions,
          totalRevenue: auctionData.totalRevenue,
        }
      },
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching marketing dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/middleware")
    const { getClient } = await import("@/lib/mongodb")
    
    const authResult = await requireAuth(request, "marketing")
    if (authResult instanceof NextResponse) return authResult

    const client = await getClient()
    const db = client.db("auctionhub")
    const { ObjectId } = await import("mongodb")

    const body = await request.json()
    const { action, campaignId, title, description, budget, startDate, endDate, targetAudience, status } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    switch (action) {
      case "create_campaign":
        if (!title || !description || !budget || !startDate || !endDate) {
          return NextResponse.json({ error: "Title, description, budget, start date, and end date are required" }, { status: 400 })
        }

        const campaign = {
          title,
          description,
          budget: parseFloat(budget),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          targetAudience: targetAudience || "all",
          status: "draft",
          createdBy: authResult.user._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const result = await db.collection("campaigns").insertOne(campaign)
        return NextResponse.json({ success: true, message: "Campaign created", campaignId: result.insertedId })

      case "update_campaign":
        if (!campaignId) {
          return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
        }

        const updateData: any = {
          updatedAt: new Date(),
          updatedBy: authResult.user._id,
        }

        if (title) updateData.title = title
        if (description) updateData.description = description
        if (budget) updateData.budget = parseFloat(budget)
        if (startDate) updateData.startDate = new Date(startDate)
        if (endDate) updateData.endDate = new Date(endDate)
        if (targetAudience) updateData.targetAudience = targetAudience
        if (status) updateData.status = status

        const updateResult = await db.collection("campaigns").updateOne(
          { _id: new ObjectId(campaignId) },
          { $set: updateData }
        )

        if (updateResult.matchedCount === 0) {
          return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Campaign updated" })

      case "launch_campaign":
        if (!campaignId) {
          return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
        }

        const launchResult = await db.collection("campaigns").updateOne(
          { _id: new ObjectId(campaignId) },
          { 
            $set: { 
              status: "active",
              launchedAt: new Date(),
              updatedAt: new Date(),
              updatedBy: authResult.user._id,
            }
          }
        )

        if (launchResult.matchedCount === 0) {
          return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Campaign launched" })

      case "pause_campaign":
        if (!campaignId) {
          return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
        }

        const pauseResult = await db.collection("campaigns").updateOne(
          { _id: new ObjectId(campaignId) },
          { 
            $set: { 
              status: "paused",
              updatedAt: new Date(),
              updatedBy: authResult.user._id,
            }
          }
        )

        if (pauseResult.matchedCount === 0) {
          return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Campaign paused" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing marketing action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
