import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, getUserById, type UserRole } from "./auth"
import { getServerSession } from "next-auth"

export async function authenticateUser(request: NextRequest) {
  
  try {
    const { getAuthOptions } = await import("@/lib/auth-config")
    const session = await getServerSession(await getAuthOptions())
    const sessionUserId = (session?.user as any)?.id as string | undefined
    if (sessionUserId) {
      const user = await getUserById(sessionUserId)
      if (user) return user
    }
  } catch {
    // Ignore and try JWT fallback
  }

  // 2) Fallback to custom JWT cookie
  const token = request.cookies.get("auth-token")?.value
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  const user = await getUserById(decoded.userId)
  return user
}

export async function requireAuth(request: NextRequest, requiredRole?: UserRole) {
  const user = await authenticateUser(request)

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    // Allow specific roles to access their own resources
    const roleSpecificAccess = ["delivery", "payment_manager", "marketing", "support"]
    if (roleSpecificAccess.includes(requiredRole) && user.role !== requiredRole) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }
    if (!roleSpecificAccess.includes(requiredRole)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }
  }

  return { user }
}
