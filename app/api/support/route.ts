import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/middleware")
    const { getClient } = await import("@/lib/mongodb")
    
    const authResult = await requireAuth(request, "support")
    if (authResult instanceof NextResponse) return authResult

    const client = await getClient()
    const db = client.db("auctionhub")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assignedTo = searchParams.get("assignedTo")

    // Build query based on filters
    const query: any = {}
    if (status) query.status = status
    if (priority) query.priority = priority
    if (assignedTo) query.assignedTo = assignedTo

    // Fetch support tickets with pagination
    const tickets = await db
      .collection("support_tickets")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection("support_tickets").countDocuments(query)

    // Get support statistics
    const ticketStats = await db.collection("support_tickets").aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]).toArray()

    const priorityStats = await db.collection("support_tickets").aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]).toArray()

    const responseTimeStats = await db.collection("support_tickets").aggregate([
      {
        $match: { status: "resolved" }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: "$responseTime" },
          avgResolutionTime: { $avg: "$resolutionTime" }
        }
      }
    ]).toArray()

    const toCount = (key: string) => ticketStats.find((s: any) => s._id === key)?.count || 0
    const toPriorityCount = (key: string) => priorityStats.find((s: any) => s._id === key)?.count || 0
    const responseData = responseTimeStats[0] || { avgResponseTime: 0, avgResolutionTime: 0 }

    return NextResponse.json({
      stats: {
        tickets: {
          total: ticketStats.reduce((sum, s) => sum + s.count, 0),
          open: toCount("open"),
          inProgress: toCount("in_progress"),
          resolved: toCount("resolved"),
          closed: toCount("closed"),
        },
        priority: {
          low: toPriorityCount("low"),
          medium: toPriorityCount("medium"),
          high: toPriorityCount("high"),
          urgent: toPriorityCount("urgent"),
        },
        performance: {
          avgResponseTime: responseData.avgResponseTime,
          avgResolutionTime: responseData.avgResolutionTime,
        }
      },
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching support dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/middleware")
    const { getClient } = await import("@/lib/mongodb")
    
    const authResult = await requireAuth(request, "support")
    if (authResult instanceof NextResponse) return authResult

    const client = await getClient()
    const db = client.db("auctionhub")
    const { ObjectId } = await import("mongodb")

    const body = await request.json()
    const { action, ticketId, subject, description, priority, status, assignedTo, response, resolution } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    switch (action) {
      case "create_ticket":
        if (!subject || !description || !priority) {
          return NextResponse.json({ error: "Subject, description, and priority are required" }, { status: 400 })
        }

        const ticket = {
          subject,
          description,
          priority,
          status: "open",
          createdBy: authResult.user._id,
          assignedTo: assignedTo || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const result = await db.collection("support_tickets").insertOne(ticket)
        return NextResponse.json({ success: true, message: "Support ticket created", ticketId: result.insertedId })

      case "update_ticket":
        if (!ticketId) {
          return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 })
        }

        const updateData: any = {
          updatedAt: new Date(),
          updatedBy: authResult.user._id,
        }

        if (subject) updateData.subject = subject
        if (description) updateData.description = description
        if (priority) updateData.priority = priority
        if (status) updateData.status = status
        if (assignedTo) updateData.assignedTo = assignedTo

        const updateResult = await db.collection("support_tickets").updateOne(
          { _id: new ObjectId(ticketId) },
          { $set: updateData }
        )

        if (updateResult.matchedCount === 0) {
          return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Ticket updated" })

      case "add_response":
        if (!ticketId || !response) {
          return NextResponse.json({ error: "Ticket ID and response are required" }, { status: 400 })
        }

        const responseData = {
          response,
          respondedBy: authResult.user._id,
          respondedAt: new Date(),
        }

        const responseResult = await db.collection("support_tickets").updateOne(
          { _id: new ObjectId(ticketId) },
          { 
            $push: { responses: responseData },
            $set: { 
              updatedAt: new Date(),
              status: "in_progress"
            }
          }
        )

        if (responseResult.matchedCount === 0) {
          return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Response added" })

      case "resolve_ticket":
        if (!ticketId || !resolution) {
          return NextResponse.json({ error: "Ticket ID and resolution are required" }, { status: 400 })
        }

        const resolutionData = {
          resolution,
          resolvedBy: authResult.user._id,
          resolvedAt: new Date(),
        }

        const resolveResult = await db.collection("support_tickets").updateOne(
          { _id: new ObjectId(ticketId) },
          { 
            $set: { 
              ...resolutionData,
              status: "resolved",
              updatedAt: new Date(),
            }
          }
        )

        if (resolveResult.matchedCount === 0) {
          return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Ticket resolved" })

      case "assign_ticket":
        if (!ticketId || !assignedTo) {
          return NextResponse.json({ error: "Ticket ID and assigned user are required" }, { status: 400 })
        }

        const assignResult = await db.collection("support_tickets").updateOne(
          { _id: new ObjectId(ticketId) },
          { 
            $set: { 
              assignedTo: new ObjectId(assignedTo),
              updatedAt: new Date(),
              updatedBy: authResult.user._id,
            }
          }
        )

        if (assignResult.matchedCount === 0) {
          return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Ticket assigned" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing support action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
