import { type NextRequest, NextResponse } from "next/server"
import { requireAuth, type UserRole } from "@/lib/middleware"
import { updateUserRole } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth(request, "admin")
  if (authResult instanceof NextResponse) return authResult

  try {
    const { role } = await request.json()

    if (!["user", "moderator", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const success = await updateUserRole(params.id, role as UserRole)

    if (!success) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "User role updated successfully" })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
