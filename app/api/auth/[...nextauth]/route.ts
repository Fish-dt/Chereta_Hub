import NextAuth from "next-auth"

export async function GET(request: any, context: any) {
  const { getAuthOptions } = await import("@/lib/auth-config")
  const handler = NextAuth(await getAuthOptions())
  return handler(request, context)
}

export async function POST(request: any, context: any) {
  const { getAuthOptions } = await import("@/lib/auth-config")
  const handler = NextAuth(await getAuthOptions())
  return handler(request, context)
}