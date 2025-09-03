import NextAuth from "next-auth"
import { NextResponse } from "next/server"

export async function GET(request: any, context: any) {
  try {
    const { getAuthOptions } = await import("@/lib/auth-config")
    const authOptions = await getAuthOptions()
    const handler = NextAuth(authOptions)
    return handler(request, context)
  } catch (error) {
    console.error("NextAuth GET error:", error)
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 500 }
    )
  }
}

export async function POST(request: any, context: any) {
  try {
    const { getAuthOptions } = await import("@/lib/auth-config")
    const authOptions = await getAuthOptions()
    const handler = NextAuth(authOptions)
    return handler(request, context)
  } catch (error) {
    console.error("NextAuth POST error:", error)
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 500 }
    )
  }
}