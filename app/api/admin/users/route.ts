import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Lazy import to prevent build-time evaluation
  const { requireAuth } = await import("@/lib/middleware")
  const clientPromise = await import("@/lib/mongodb")
  
  const authResult = await requireAuth(request, "moderator")
  if (authResult instanceof NextResponse) return authResult

  try {
    const client = await clientPromise.default
    const db = client.db("auctionhub")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const role = searchParams.get("role")

    const query: any = {}
    if (role && role !== "all") {
      query.role = role
    }

    const users = await db
      .collection("users")
      .find(query, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection("users").countDocuments(query)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
