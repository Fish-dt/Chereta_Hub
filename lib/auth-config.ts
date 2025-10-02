import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { getClient } from "@/lib/mongodb"
import { compare } from "bcryptjs"

export async function getAuthOptions(): Promise<NextAuthOptions> {
  try {
    const clientPromise = getClient()
    return {
      adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const client = await getClient()
          const db = client.db("auctionhub")
          const user = await db.collection("users").findOne({ email: credentials.email })
          if (!user) return null
          const isValid = await compare(credentials.password, user.password)
          if (!isValid) return null
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            image: user.avatar || null,
          }
        } catch (error) {
          console.error("Error in credentials auth:", error)
          return null
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "select_account",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
  ],
    callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const client = await getClient()
          const db = client.db("auctionhub")

          // Check if user exists in our custom users collection
          const existingUser = await db.collection("users").findOne({ email: user.email })

          if (!existingUser) {
            // Create user in our custom users collection
            await db.collection("users").insertOne({
              email: user.email,
              firstName: user.name?.split(" ")[0] || "",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              avatar: user.image,
              role: "user",
              rating: 0,
              totalSales: 0,
              memberSince: new Date(),
              isVerified: true,
              provider: "google",
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          } else {
            // Update existing user to include Google provider info
            await db.collection("users").updateOne(
              { email: user.email },
              { 
                $set: { 
                  provider: "google",
                  avatar: user.image,
                  updatedAt: new Date()
                }
              }
            )
          }

          return true
        } catch (error) {
          console.error("Error during Google sign in:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token, user }) {
      try {
        // Use token fields if available (JWT strategy)
        if (token) {
          (session.user as any).id = token.id;
          (session.user as any).role = token.role;
          (session.user as any).firstName = token.firstName;
          (session.user as any).lastName = token.lastName;
          (session.user as any).image = token.image;
        }
        
        // Ensure session has all required user data
        if (session.user && !(session.user as any).id && token) {
          (session.user as any).id = token.id;
          (session.user as any).role = token.role;
          (session.user as any).firstName = token.firstName;
          (session.user as any).lastName = token.lastName;
          (session.user as any).image = token.image;
        }
        
        return session;
      } catch (error) {
        console.error("Error in session callback:", error)
        return session
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          const u = user as any;
          token.id = u.id;
          token.email = u.email;
          token.role = u.role;
          token.firstName = u.firstName;
          token.lastName = u.lastName;
          token.image = u.image;
        }
        
        // Handle Google OAuth user data
        if (account?.provider === "google" && user) {
          try {
            const client = await getClient();
            const db = client.db("auctionhub");
            const dbUser = await db.collection("users").findOne({ email: user.email });
            
            if (dbUser) {
              token.id = dbUser._id.toString();
              token.email = dbUser.email;
              token.role = dbUser.role;
              token.firstName = dbUser.firstName;
              token.lastName = dbUser.lastName;
              token.image = dbUser.avatar;
            }
          } catch (error) {
            console.error("Error fetching user data in JWT callback:", error);
          }
        }
        
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      } catch (error) {
        console.error("Error in JWT callback:", error)
        return token
      }
    },
    },
    pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    },
    session: {
    strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    allowDangerousEmailAccountLinking: true,
  }
  } catch (error) {
    console.error("Error creating auth options:", error)
    throw new Error(`Failed to create auth configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
