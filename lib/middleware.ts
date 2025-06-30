import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, getUserById, type UserRole } from "./auth"

export async function authenticateUser(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return null
  }

  const user = await getUserById(decoded.userId)
  return user
}

export async function requireAuth(request: NextRequest, requiredRole?: UserRole) {
  const user = await authenticateUser(request)

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  return { user }
}
