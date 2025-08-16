import NextAuth from "next-auth"

export async function GET(request: any, context: any) {
  const { authOptions } = await import("@/lib/auth-config")
  const handler = NextAuth(authOptions)
  return handler(request, context)
}

export async function POST(request: any, context: any) {
  const { authOptions } = await import("@/lib/auth-config")
  const handler = NextAuth(authOptions)
  return handler(request, context)
}