import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs" // if passwords are hashed
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest, context: any) {
  try {
    const handler = NextAuth(await getAuthOptions())
    return handler(request, context)
  } catch (error) {
    console.error("NextAuth GET error:", error)
    return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const handler = NextAuth(await getAuthOptions())
    return handler(request, context)
  } catch (error) {
    console.error("NextAuth POST error:", error)
    return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
  }
}

async function getAuthOptions() {
  return {
    providers: [
      CredentialsProvider({
        id: "google-one-tap",
        name: "Google One Tap",
        credentials: {
          id_token: { label: "Google ID Token", type: "text" },
        },
        async authorize(credentials) {
          try {
            const idToken = credentials?.id_token
            if (!idToken) throw new Error("Missing Google ID token")

            // Verify the ID token with Google
            const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`)
            if (!verifyRes.ok) {
              throw new Error("Invalid Google ID token")
            }
            const decoded: any = await verifyRes.json()

            if (!decoded?.email) throw new Error("Google token missing email")

            const { connectToDatabase } = await import("@/lib/mongodb")
            const { db } = await connectToDatabase()

            // Upsert user
            let existingUser = await db.collection("users").findOne({ email: decoded.email })
            if (!existingUser) {
              const result = await db.collection("users").insertOne({
                email: decoded.email,
                firstName: decoded.given_name || decoded.name?.split(" ")[0] || "",
                lastName: decoded.family_name || decoded.name?.split(" ").slice(1).join(" ") || "",
                avatar: decoded.picture || null,
                role: "user",
                rating: 0,
                totalSales: 0,
                memberSince: new Date(),
                isVerified: true,
                provider: "google",
                googleId: decoded.sub,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
              existingUser = { _id: result.insertedId }
            } else {
              await db.collection("users").updateOne(
                { email: decoded.email },
                {
                  $set: {
                    provider: "google",
                    googleId: decoded.sub,
                    avatar: decoded.picture || existingUser.avatar || null,
                    updatedAt: new Date(),
                  },
                }
              )
            }

            // Upsert account
            const existingAccount = await db.collection("accounts").findOne({
              provider: "google",
              providerAccountId: decoded.sub,
            })
            if (!existingAccount) {
              await db.collection("accounts").insertOne({
                userId: existingUser?._id,
                type: "oauth",
                provider: "google",
                providerAccountId: decoded.sub,
                id_token: idToken,
                access_token: null,
                refresh_token: null,
                expires_at: null,
                token_type: null,
                scope: null,
              })
            }

            return {
              id: existingUser?._id.toString(),
              email: decoded.email,
              name: decoded.name,
              image: decoded.picture,
            } as any
          } catch (e) {
            console.error("One Tap authorize error:", e)
            return null
          }
        },
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
          turnstileToken: { label: "Turnstile Token", type: "text" },
        },
        async authorize(credentials) {
          if (process.env.NODE_ENV === "production" && credentials?.turnstileToken) {
            const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
              method: "POST",
              body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET_KEY!,
                response: credentials.turnstileToken,
              }),
            })
        
            const verifyData = await verifyRes.json()
            if (!verifyData.success) {
              console.error("Turnstile failed:", verifyData)
              throw new Error("Failed captcha verification")
            }
          } else {
            console.log("⚠️ Skipping Turnstile validation in dev or when empty")
          }
        
          // 🔹 Normal DB login
          const { connectToDatabase } = await import("@/lib/mongodb")
          const { db } = await connectToDatabase()
        
          const user = await db.collection("users").findOne({ email: credentials?.email })
          if (!user) throw new Error("No user found")
        
          const validPassword = await compare(credentials!.password, user.password)
          if (!validPassword) throw new Error("Invalid password")
        
          return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar || null,
          }
        }
        
        ,
      }),

      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "select_account",
            access_type: "offline",
            response_type: "code"
          }
        }
      }),
    ],

    callbacks: {
      async signIn({ user, account, profile, credentials }: { user: any; account: any; profile?: any; credentials?: any }) {
        // Handle regular Google OAuth flow
        if (account?.provider === "google") {
          const { connectToDatabase } = await import("@/lib/mongodb")
          const { db } = await connectToDatabase()

          let existingUser = await db.collection("users").findOne({ email: user.email })

          if (!existingUser) {
            const result = await db.collection("users").insertOne({
              email: user.email,
              firstName: user.name?.split(" ")[0] || "",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              avatar: user.image || null,
              memberSince: new Date(),
            })
            existingUser = { _id: result.insertedId, ...user }
          }

          const existingAccount = await db.collection("accounts").findOne({
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          })

          if (!existingAccount) {
            await db.collection("accounts").insertOne({
              userId: existingUser?._id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token || null,
              refresh_token: account.refresh_token || null,
              expires_at: account.expires_at || null,
              token_type: account.token_type || null,
              scope: account.scope || null,
              id_token: account.id_token || null,
            })
          }

          // attach MongoDB user id to NextAuth session token
          user.id = existingUser?._id.toString()
        }
        return true
      },

      async jwt({ token, user }: { token: any; user: any }) {
        if (user?.id) token.id = user.id
        return token
      },

      async session({ session, token }: { session: any; token: any }) {
        session.user.id = token.id
        return session
      },
    },

    pages: {
      signIn: "/auth/login",
      error: "/auth/login",
    },
  }
}

