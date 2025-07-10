import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const profile = await db
      .collection("users")
      .findOne({ email: session.user.email }, { projection: { password: 0 } })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { firstName, lastName, phone, location, bio } = await request.json()
    const { db } = await connectToDatabase()
    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          firstName,
          lastName,
          phone,
          location,
          bio,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
