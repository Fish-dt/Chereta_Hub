import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Lazy import to prevent build-time evaluation
  const { connectToDatabase } = await import("@/lib/mongodb")
  
  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection("categories").find({}).toArray()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}