import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/middleware")
    const { getClient } = await import("@/lib/mongodb")
    
    const authResult = await requireAuth(request, "payment_manager")
    if (authResult instanceof NextResponse) return authResult

    const client = await getClient()
    const db = client.db("auctionhub")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status")
    const type = searchParams.get("type") // transactions, refunds, chargebacks

    // Build query based on filters
    const query: any = {}
    if (status) query.status = status
    if (type) query.type = type

    let collection = "payments"
    if (type === "refunds") collection = "refunds"
    if (type === "chargebacks") collection = "chargebacks"

    // Fetch payments/transactions with pagination
    const transactions = await db
      .collection(collection)
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection(collection).countDocuments(query)

    // Get payment statistics
    const statsAgg = await db.collection("payments").aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]).toArray()

    const refundsStats = await db.collection("refunds").aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]).toArray()

    const toCount = (key: string) => statsAgg.find((s: any) => s._id === key)?.count || 0
    const toAmount = (key: string) => statsAgg.find((s: any) => s._id === key)?.totalAmount || 0
    const toRefundCount = (key: string) => refundsStats.find((s: any) => s._id === key)?.count || 0
    const toRefundAmount = (key: string) => refundsStats.find((s: any) => s._id === key)?.totalAmount || 0

    return NextResponse.json({
      stats: {
        totalPayments: statsAgg.reduce((sum, s) => sum + s.count, 0),
        totalAmount: statsAgg.reduce((sum, s) => sum + s.totalAmount, 0),
        pendingPayments: toCount("pending"),
        completedPayments: toCount("completed"),
        failedPayments: toCount("failed"),
        pendingAmount: toAmount("pending"),
        completedAmount: toAmount("completed"),
        failedAmount: toAmount("failed"),
        refundsIssued: toRefundCount("completed"),
        refundsPending: toRefundCount("pending"),
        refundsAmount: toRefundAmount("completed"),
        pendingRefundsAmount: toRefundAmount("pending"),
      },
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching payment manager dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/middleware")
    const { getClient } = await import("@/lib/mongodb")
    
    const authResult = await requireAuth(request, "payment_manager")
    if (authResult instanceof NextResponse) return authResult

    const client = await getClient()
    const db = client.db("auctionhub")
    const { ObjectId } = await import("mongodb")

    const body = await request.json()
    const { action, transactionId, amount, reason, status } = body

    if (!action || !transactionId) {
      return NextResponse.json({ error: "Action and transaction ID are required" }, { status: 400 })
    }

    switch (action) {
      case "process_refund":
        if (!amount || !reason) {
          return NextResponse.json({ error: "Amount and reason are required for refunds" }, { status: 400 })
        }

        // Create refund record
        const refund = {
          transactionId: new ObjectId(transactionId),
          amount: parseFloat(amount),
          reason,
          status: "pending",
          processedBy: authResult.user._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        await db.collection("refunds").insertOne(refund)

        // Update original transaction status
        await db.collection("payments").updateOne(
          { _id: new ObjectId(transactionId) },
          { 
            $set: { 
              status: "refund_pending",
              updatedAt: new Date(),
            }
          }
        )

        return NextResponse.json({ success: true, message: "Refund request created" })

      case "update_status":
        if (!status) {
          return NextResponse.json({ error: "Status is required" }, { status: 400 })
        }

        const updateData: any = {
          status,
          updatedAt: new Date(),
          processedBy: authResult.user._id,
        }

        const result = await db.collection("payments").updateOne(
          { _id: new ObjectId(transactionId) },
          { $set: updateData }
        )

        if (result.matchedCount === 0) {
          return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Transaction status updated" })

      case "approve_refund":
        // Update refund status to completed
        const refundResult = await db.collection("refunds").updateOne(
          { _id: new ObjectId(transactionId) },
          { 
            $set: { 
              status: "completed",
              updatedAt: new Date(),
              processedBy: authResult.user._id,
            }
          }
        )

        if (refundResult.matchedCount === 0) {
          return NextResponse.json({ error: "Refund not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Refund approved" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing payment manager action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
