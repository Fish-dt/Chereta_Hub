import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role, secretKey } = await request.json()

    // Secret key to prevent unauthorized admin creation
    if (secretKey !== "SUPER_SECRET_ADMIN_KEY_2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["admin", "moderator"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const userId = await createUser({
      email,
      password,
      firstName,
      lastName,
      role: role as "admin" | "moderator",
    })

    return NextResponse.json({
      success: true,
      message: `${role} created successfully`,
      userId: userId.toString(),
    })
  } catch (error: any) {
    console.error("Error creating admin:", error)

    if (error.message === "User already exists") {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}
