import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs" // if passwords are hashed

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
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
          turnstileToken: { label: "Turnstile Token", type: "text" }, // 🔑 added
        },
        async authorize(credentials) {
          // 🔹 1. Optional Turnstile verification
          if (credentials?.turnstileToken) {
            const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
              method: "POST",
              body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET_KEY!,
                response: credentials.turnstileToken,
              }),
            });
        
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              console.error("Turnstile failed:", verifyData);
              throw new Error("Failed captcha verification");
            }
          }
        
          // 🔹 2. Normal credentials login
          const { connectToDatabase } = await import("@/lib/mongodb");
          const { db } = await connectToDatabase();
        
          const user = await db.collection("users").findOne({ email: credentials?.email });
          if (!user) throw new Error("No user found");
        
          const validPassword = await compare(credentials!.password, user.password);
          if (!validPassword) throw new Error("Invalid password");
        
          return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar || null,
          };
        }
        ,
      }),

      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],

    callbacks: {
      async signIn({ user, account }: { user: any; account: any }) {
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
